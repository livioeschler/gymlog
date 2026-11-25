// Supabase Edge Function: water-reminder
// Wird stündlich per pg_cron aufgerufen. Um 11, 14, 17 und 20 Uhr (Europe/Berlin)
// prüft sie, ob genug Wasser getrunken wurde, und schickt sonst eine Push-Mitteilung.
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

// Uhrzeit -> Anteil des Tagesziels, der bis dann getrunken sein sollte
const CHECKS: Record<number, number> = { 11: 0.3, 14: 0.5, 17: 0.7, 20: 0.85 };
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const liter = (ml: number) => (ml / 1000).toLocaleString("de-DE", { maximumFractionDigits: 2 });

Deno.serve(async (req) => {
  const expected = (Deno.env.get("CRON_SECRET") ?? "").trim();
  const got = (req.headers.get("x-cron-secret") ?? "").trim();
  if (!expected || got !== expected) {
    // Diagnose ohne das Passwort selbst zu verraten
    const info = {
      secret_in_supabase_gesetzt: expected.length > 0,
      laenge_secret: expected.length,
      header_mitgeschickt: got.length > 0,
      laenge_header: got.length,
      gleicher_anfang: expected.length > 2 && got.slice(0, 2) === expected.slice(0, 2),
    };
    console.log("forbidden", JSON.stringify(info));
    return Response.json({ error: "forbidden", ...info }, { status: 403 });
  }
  const test = new URL(req.url).searchParams.get("test") === "1";

  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", hourCycle: "h23", weekday: "short",
    }).formatToParts(new Date()).map((x) => [x.type, x.value]),
  );
  const today = `${p.year}-${p.month}-${p.day}`;
  const hour = Number(p.hour);
  const share = CHECKS[hour];
  if (share === undefined && !test) return Response.json({ skipped: true, hour });

  const db = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });
  const { data: subs, error } = await db.from("push_subs").select("endpoint,user_id,sub");
  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!subs?.length) return Response.json({ hour, sent: 0, note: "keine Abos" });

  const ids = [...new Set(subs.map((s) => s.user_id))];
  const { data: states, error: e2 } = await db.from("gymlog_state").select("user_id,data").in("user_id", ids);
  if (e2) return Response.json({ error: e2.message }, { status: 500 });

  let sent = 0;
  for (const st of states ?? []) {
    const d = st.data ?? {}, s = d.settings ?? {};
    const ml = Number((d.water ?? {})[today] ?? 0);
    const train = (s.days ?? []).includes(WD.indexOf(p.weekday)) ||
      (d.workouts ?? []).some((w: { date: string }) => w.date === today);
    const goal = Number(s.waterCustom) > 0
      ? Math.round(Number(s.waterCustom) * 1000)
      : Math.round(((Number(s.weight) || 75) * 35 + (train ? 500 : 0)) / 250) * 250;
    if (!test && ml >= goal * share) continue;

    const payload = JSON.stringify({
      title: test ? "Test: Wasser-Erinnerung" : "Trink etwas Wasser",
      body: `Erst ${liter(ml)} l von ${liter(goal)} l heute. Zeit für ein Glas!`,
      tag: "water", url: "./#essen",
    });
    for (const sub of subs.filter((x) => x.user_id === st.user_id)) {
      try {
        await webpush.sendNotification(sub.sub, payload, { TTL: 3600 });
        sent++;
      } catch (e) {
        const code = (e as { statusCode?: number }).statusCode;
        if (code === 404 || code === 410) await db.from("push_subs").delete().eq("endpoint", sub.endpoint);
      }
    }
  }
  return Response.json({ hour, sent });
});
