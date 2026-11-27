// Supabase Edge Function: garmin-sync
// Holt Aktivitäten (inkl. GPS-Route aus der FIT-Datei) über die Garmin Connect Personal API
// und speichert sie in der Tabelle garmin_activities. Wird von der App aufgerufen (angemeldeter Nutzer).
//
// Benötigtes Secret: GARMIN_API_KEY (Personal API Key aus Garmin Connect)
// "Verify JWT" für diese Funktion ausschalten – die Funktion prüft die Anmeldung selbst.
import { createClient } from "npm:@supabase/supabase-js@2.119.0";
import { unzipSync } from "npm:fflate@0.8.2";
import FitParser from "npm:fit-file-parser@6.2.3";

const BASE = "https://personal.connectapi.garmin.com";
const TOKEN_PATH = "/personalapitoken-service/personal-api/personal-api-key/token";
const FIRST_SYNC_DAYS = 180; // beim ersten Mal so weit zurück
const MAX_FIT_PER_CALL = 12; // Routen pro Aufruf (Rest beim nächsten Aufruf)
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
// deno-lint-ignore no-explicit-any
type Any = any;
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const day = (d: Date) => d.toISOString().slice(0, 10);

async function trackFromZip(bytes: Uint8Array): Promise<number[][] | null> {
  let fit: Uint8Array | undefined;
  try {
    const files = unzipSync(bytes);
    const name = Object.keys(files).find((n) => n.toLowerCase().endsWith(".fit"));
    fit = name ? files[name] : undefined;
  } catch {
    fit = bytes; // evtl. direkt eine FIT-Datei
  }
  if (!fit) return null;
  const parser = new FitParser({ force: true, mode: "list" });
  const data: Any = await parser.parseAsync(fit.buffer.slice(fit.byteOffset, fit.byteOffset + fit.byteLength));
  const pts = (data.records ?? [])
    .filter((r: Any) => typeof r.position_lat === "number" && typeof r.position_long === "number")
    .map((r: Any) => [+r.position_lat.toFixed(5), +r.position_long.toFixed(5)]);
  if (pts.length < 2) return null;
  const step = Math.max(1, Math.ceil(pts.length / 400));
  const out = pts.filter((_: unknown, i: number) => i % step === 0);
  if (out[out.length - 1] !== pts[pts.length - 1]) out.push(pts[pts.length - 1]);
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const db = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SERVICE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
  const jwt = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: auth, error: authErr } = await db.auth.getUser(jwt);
  if (authErr || !auth?.user) return json({ error: "Nicht angemeldet." }, 401);
  const userId = auth.user.id;

  const key = (Deno.env.get("GARMIN_API_KEY") ?? "").trim();
  if (!key) return json({ error: "Secret GARMIN_API_KEY fehlt in Supabase." }, 500);

  const tr = await fetch(BASE + TOKEN_PATH, { method: "POST", headers: { Authorization: `ApiKey ${key}` } });
  if (!tr.ok) {
    return json({ error: `Garmin lehnt den API-Key ab (HTTP ${tr.status}). Ist er abgelaufen oder falsch kopiert?`, detail: (await tr.text()).slice(0, 300) }, 502);
  }
  const token = (await tr.text()).trim();
  const garmin = (path: string, accept = "application/json") =>
    fetch(BASE + path, { headers: { Authorization: `Bearer ${token}`, Accept: accept } });

  // Zeitraum: beim ersten Mal 180 Tage, danach ab der letzten Aktivität (mit 3 Tagen Überlappung)
  const { data: last } = await db.from("garmin_activities").select("start_time").eq("user_id", userId)
    .order("start_time", { ascending: false }).limit(1);
  const end = new Date(Date.now() + 864e5);
  const start = last?.[0]?.start_time
    ? new Date(Date.parse(last[0].start_time) - 3 * 864e5)
    : new Date(Date.now() - FIRST_SYNC_DAYS * 864e5);

  const acts: Any[] = [];
  for (let s = 0; s < 1000; s += 100) {
    const r = await garmin(`/activitylist-service/activities/search/activities?start=${s}&limit=100&startDate=${day(start)}&endDate=${day(end)}`);
    if (!r.ok) return json({ error: `Garmin-Aktivitäten: HTTP ${r.status}`, detail: (await r.text()).slice(0, 300) }, 502);
    const page: Any = await r.json();
    const arr: Any[] = Array.isArray(page) ? page : (page?.activityList ?? page?.activities ?? []);
    acts.push(...arr);
    if (arr.length < 100) break;
  }

  // Routen fehlen noch bei: neuen Aktivitäten und älteren, deren Route noch nicht geladen ist
  const { data: have } = await db.from("garmin_activities").select("id,start_time,track,data").eq("user_id", userId);
  const known = new Map((have ?? []).map((x: Any) => [String(x.id), x]));
  const withTrack: Any[] = [], noTrack: Any[] = [];
  let fits = 0, more = 0;
  const seen = new Set<string>();
  const fetchTrack = async (id: string | number) => {
    const r = await garmin(`/download-service/files/activity/${id}`, "application/zip, application/x-zip-compressed, application/octet-stream");
    return { ok: r.ok, track: r.ok ? await trackFromZip(new Uint8Array(await r.arrayBuffer())) : null };
  };

  for (const a of acts) {
    const id = a.activityId ?? a.activityID ?? a.id;
    if (!id) continue;
    seen.add(String(id));
    const startIso = a.startTimeGMT ? new Date(String(a.startTimeGMT).replace(" ", "T") + "Z").toISOString() : null;
    const data: Any = {
      name: a.activityName ?? "", type: a.activityType?.typeKey ?? a.activityType ?? "",
      start_local: a.startTimeLocal ?? null, distance: a.distance ?? null, duration: a.duration ?? null,
      moving: a.movingDuration ?? null, avg_hr: a.averageHR ?? null, max_hr: a.maxHR ?? null,
      calories: a.calories ?? null, elev_gain: a.elevationGain ?? null, avg_speed: a.averageSpeed ?? null,
      has_gps: a.hasPolyline ?? (a.startLatitude != null),
    };
    const row = { user_id: userId, id: Number(id), start_time: startIso, data };
    const old = known.get(String(id));
    if (data.has_gps && !old?.track && !old?.data?.no_track) {
      if (fits < MAX_FIT_PER_CALL) {
        fits++;
        try {
          const r = await fetchTrack(id);
          if (r.track) { withTrack.push({ ...row, track: r.track }); continue; }
          if (r.ok) row.data = { ...data, no_track: true };
        } catch (e) { console.log("FIT", id, String(e)); }
      } else more++;
    }
    noTrack.push(row);
  }
  // ältere Aktivitäten, deren Route beim letzten Mal noch nicht geladen wurde
  for (const old of have ?? []) {
    if (seen.has(String(old.id)) || old.track || !old.data?.has_gps || old.data?.no_track) continue;
    if (fits >= MAX_FIT_PER_CALL) { more++; continue; }
    fits++;
    try {
      const r = await fetchTrack(old.id);
      if (r.track) withTrack.push({ user_id: userId, id: old.id, start_time: old.start_time, data: old.data, track: r.track });
      else if (r.ok) noTrack.push({ user_id: userId, id: old.id, start_time: old.start_time, data: { ...old.data, no_track: true } });
    } catch (e) { console.log("FIT", old.id, String(e)); }
  }
  if (withTrack.length) {
    const { error } = await db.from("garmin_activities").upsert(withTrack);
    if (error) return json({ error: error.message }, 500);
  }
  if (noTrack.length) {
    const { error } = await db.from("garmin_activities").upsert(noTrack);
    if (error) return json({ error: error.message }, 500);
  }
  return json({ found: acts.length, saved: withTrack.length + noTrack.length, routes: withTrack.length, more });
});
