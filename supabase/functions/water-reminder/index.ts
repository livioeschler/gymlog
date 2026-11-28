// Supabase Edge Function: water-reminder (verschickt alle Gymlog-Erinnerungen)
// Wird jede Minute per pg_cron aufgerufen und prüft für jedes Konto,
// welche Erinnerungen genau jetzt fällig sind (Zeitzone Europe/Berlin).
//
// Benötigte Secrets: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, CRON_SECRET (optional VAPID_CONTACT)
// "Verify JWT" für diese Funktion ausschalten – geschützt wird sie über den Header x-cron-secret.
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2.119.0";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_KEY = Deno.env.get("SERVICE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
webpush.setVapidDetails(
  "mailto:" + (Deno.env.get("VAPID_CONTACT") ?? "gymlog@example.com"),
  Deno.env.get("VAPID_PUBLIC_KEY")!,
  Deno.env.get("VAPID_PRIVATE_KEY")!,
);

type Msg = { title: string; body: string; tag: string; url?: string };
// deno-lint-ignore no-explicit-any
type Any = any;

const WATER_CHECKS: Record<number, number> = { 11: 0.3, 14: 0.5, 17: 0.7, 20: 0.85 };
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const ORDER = ["push", "pull", "legs"];
const LBL: Record<string, string> = { push: "Push", pull: "Pull", legs: "Legs" };
const RDEF: Any = {
  train: { on: true, lead: 30 }, missed: { on: false, time: "21:00" }, water: { on: true },
  prep: { on: false, days: [0, 3], time: "17:00" }, weekly: { on: true, day: 0, time: "19:00" }, custom: [],
};
const liter = (ml: number) => (ml / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 });
const toMin = (t: string) => {
  const [h, m] = String(t ?? "").split(":").map(Number);
  return Number.isFinite(h) ? h * 60 + (Number.isFinite(m) ? m : 0) : NaN;
};

function berlinNow() {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23", weekday: "short",
    }).formatToParts(new Date()).map((x) => [x.type, x.value]),
  );
  const y = +p.year, mo = +p.month, d = +p.day, h = +p.hour, mi = +p.minute;
  const dow = WD.indexOf(p.weekday);
  const iso = (dt: Date) => dt.toISOString().slice(0, 10);
  const monday = new Date(Date.UTC(y, mo - 1, d - ((dow + 6) % 7)));
  return { today: `${p.year}-${p.month}-${p.day}`, h, mi, dow, monday: iso(monday) };
}

// Wasserziel wie in der App: Grundwert, der sich langsam an die letzten 14 Tage anpasst (max. 5 l)
function waterGoal(data: Any, today: string, train: boolean): number {
  const s = data?.settings ?? {};
  if (Number(s.waterCustom) > 0) return Math.round(Number(s.waterCustom) * 1000);
  const r250 = (x: number) => Math.round(x / 250) * 250;
  const base = r250((Number(s.weight) || 75) * 35 + (train ? 500 : 0));
  if (s.waterAdapt === false) return base;
  const [y, m, d] = today.split("-").map(Number);
  let ema = base;
  for (let i = 14; i >= 1; i--) {
    const key = new Date(Date.UTC(y, m - 1, d - i)).toISOString().slice(0, 10);
    const ml = Number((data?.water ?? {})[key] ?? 0);
    if (ml > 0) ema += 0.25 * (ml - ema);
  }
  return Math.min(5000, Math.max(base, r250(ema)));
}

function remindersFor(data: Any, now: ReturnType<typeof berlinNow>): Msg[] {
  const s = data?.settings ?? {}, r = { ...RDEF, ...(s.rem ?? {}) };
  const nowMin = now.h * 60 + now.mi;
  const due = (min: number) => min === nowMin;
  const days: number[] = s.days ?? [1, 3, 5];
  const workouts: Any[] = data?.workouts ?? [];
  const trainDay = days.includes(now.dow);
  const doneToday = workouts.some((w) => w.date === now.today);
  const last = [...workouts].sort((a, b) => b.date.localeCompare(a.date) || String(b.id).localeCompare(String(a.id)))[0];
  const next = last ? ORDER[(ORDER.indexOf(last.type) + 1) % 3] : "push";
  const out: Msg[] = [];

  if (r.train?.on && trainDay && !doneToday && due(toMin(s.time ?? "18:00") - (+r.train.lead || 30))) {
    out.push({ tag: "train", title: `Gleich Gym: ${LBL[next]}-Tag`, body: `Training um ${s.time ?? "18:00"} Uhr. Dein Plan wartet in der App – viel Erfolg!`, url: "./#uebersicht" });
  }
  if (r.missed?.on && trainDay && !doneToday && due(toMin(r.missed.time))) {
    out.push({ tag: "missed", title: "Training eingetragen?", body: `Heute ist ${LBL[next]}-Tag und noch nichts eingetragen. Trag es ein, solange du die Gewichte noch weißt.`, url: "./#training" });
  }
  const share = WATER_CHECKS[now.h];
  if (r.water?.on !== false && share !== undefined && now.mi === 0) {
    const ml = Number((data?.water ?? {})[now.today] ?? 0);
    const train = trainDay || doneToday;
    const goal = waterGoal(data, now.today, train);
    if (ml < goal * share) out.push({ tag: "water", title: "Trink etwas Wasser", body: `Erst ${liter(ml)} l von ${liter(goal)} l heute. Zeit für ein Glas!`, url: "./#essen" });
  }
  if (r.prep?.on && (r.prep.days ?? []).includes(now.dow) && due(toMin(r.prep.time))) {
    out.push({ tag: "prep", title: "Mealprep-Zeit", body: "Zeit fürs Vorkochen – Rezepte und Einkaufsliste findest du in der App.", url: "./#essen" });
  }
  if (r.weekly?.on && now.dow === (+r.weekly.day || 0) && due(toMin(r.weekly.time))) {
    const ws = workouts.filter((w) => w.date >= now.monday && w.date <= now.today);
    const sets = ws.reduce((a, w) => a + (w.sets ?? []).filter((x: Any) => +x.r > 0).length, 0);
    const kg = ws.reduce((a, w) => a + (w.sets ?? []).reduce((b: number, x: Any) => b + (+x.w || 0) * (+x.r || 0), 0), 0);
    const goal = days.length || 3;
    out.push({
      tag: "weekly", title: "Dein Wochenrückblick",
      body: `${ws.length} von ${goal} Training${goal === 1 ? "" : "s"} · ${sets} ${sets === 1 ? "Satz" : "Sätze"} · ${Math.round(kg).toLocaleString("de-DE")} kg bewegt. ${ws.length >= goal ? "Starke Woche!" : "Nächste Woche packst du es!"}`,
      url: "./#uebersicht",
    });
  }
  for (const c of r.custom ?? []) {
    if ((c.days ?? []).includes(now.dow) && due(toMin(c.time))) {
      out.push({ tag: "c" + c.id, title: "Gymlog", body: String(c.text ?? "").slice(0, 120), url: "./#uebersicht" });
    }
  }
  return out;
}

Deno.serve(async (req) => {
  const expected = (Deno.env.get("CRON_SECRET") ?? "").trim();
  const got = (req.headers.get("x-cron-secret") ?? "").trim();
  if (!expected || got !== expected) {
    const info = { secret_in_supabase_gesetzt: expected.length > 0, laenge_secret: expected.length, header_mitgeschickt: got.length > 0, laenge_header: got.length };
    console.log("forbidden", JSON.stringify(info));
    return Response.json({ error: "forbidden", ...info }, { status: 403 });
  }
  const test = new URL(req.url).searchParams.get("test") === "1";
  const now = berlinNow();

  const db = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });

  // Pausen-Timer: wird alle 10 Sekunden aufgerufen, sobald ein Timer in den nächsten 10 Sekunden endet
  if (new URL(req.url).searchParams.get("rest") === "1") {
    const soon = new Date(Date.now() + 10_000).toISOString();
    const { data: due, error: e0 } = await db.from("rest_timers").update({ sent: true })
      .eq("sent", false).lte("end_at", soon).select("user_id,end_at,label");
    if (e0) return Response.json({ error: e0.message }, { status: 500 });
    let sentRest = 0;
    await Promise.all((due ?? []).map(async (t) => {
      const wait = Date.parse(t.end_at) - Date.now();
      if (wait > 0) await new Promise((r) => setTimeout(r, Math.min(wait, 12_000)));
      const { data: subs } = await db.from("push_subs").select("endpoint,sub").eq("user_id", t.user_id);
      const msg = JSON.stringify({ title: "Pause vorbei", body: t.label || "Weiter geht's – nächster Satz!", tag: "rest", url: "./#training" });
      for (const s of subs ?? []) {
        try { await webpush.sendNotification(s.sub, msg, { TTL: 120, urgency: "high" }); sentRest++; }
        catch (e) { const c = (e as { statusCode?: number }).statusCode; if (c === 404 || c === 410) await db.from("push_subs").delete().eq("endpoint", s.endpoint); }
      }
    }));
    return Response.json({ rest: due?.length ?? 0, sent: sentRest });
  }
  const { data: subs, error } = await db.from("push_subs").select("endpoint,user_id,sub");
  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!subs?.length) return Response.json({ time: `${now.h}:${now.mi}`, sent: 0, note: "keine Abos" });

  const ids = [...new Set(subs.map((s) => s.user_id))];
  const { data: states, error: e2 } = await db.from("gymlog_state").select("user_id,data").in("user_id", ids);
  if (e2) return Response.json({ error: e2.message }, { status: 500 });

  let sent = 0;
  const tags: string[] = [];
  for (const st of states ?? []) {
    const msgs = test
      ? [{ tag: "test", title: "Test: Gymlog", body: "Push-Mitteilungen funktionieren ✓", url: "./#plan" }]
      : remindersFor(st.data, now);
    for (const m of msgs) {
      tags.push(m.tag);
      for (const sub of subs.filter((x) => x.user_id === st.user_id)) {
        try {
          await webpush.sendNotification(sub.sub, JSON.stringify(m), { TTL: 1800 });
          sent++;
        } catch (e) {
          const code = (e as { statusCode?: number }).statusCode;
          if (code === 404 || code === 410) await db.from("push_subs").delete().eq("endpoint", sub.endpoint);
        }
      }
    }
  }
  return Response.json({ time: `${now.h}:${String(now.mi).padStart(2, "0")}`, sent, tags });
});
