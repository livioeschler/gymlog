# Änderungsprotokoll

Neueste Einträge oben. Jeder tägliche Verbesserungs-Durchlauf ergänzt hier einen Abschnitt.

## 2026-11-26 – Navigation ruhiger
- Navigation am Handy nur noch mit Icons (Beschriftung für Screenreader erhalten)
- Jede Seite ist mindestens bildschirmhoch; beim Wechsel wird zuerst nach oben gescrollt, damit die Leiste nicht springt

## 2026-11-26 – Updates kommen sofort an
- Service Worker umgeht beim Laden der Seite den Browser-Cache, sucht beim Öffnen nach neuen Versionen und lädt die App automatisch neu (außer während ein Training eingetragen wird)

## 2026-11-26 – Navigation unten mit Icons
- Auf dem Handy sitzt die Navigation fest am unteren Rand (Icons + kurze Beschriftung), verschwindet beim Tippen in Eingabefelder
- Am PC bleibt sie oben, jetzt mit Icons
- Plan: Übungsname steht immer über Sätzen/Wdh. (auch am PC lesbar)

## 2026-11-26 – Lernendes Wasserziel
- Wasserziel passt sich langsam an die letzten 14 Tage an (gleitender Durchschnitt, 25 % pro Tag), nie unter den Grundwert, max. 5 l
- Schalter „Ziel lernt mit“ im Wasserbereich (Standard: an); eigenes Ziel ersetzt weiterhin alles
- Edge Function rechnet dasselbe Ziel (neu deployen nötig)

## 2026-11-25 – Farbschema „Nebel“
- Ruhigere Farben: helles Grau statt Rot im Kopfbereich, Schiefergrau als Akzent, gedämpftes Blaugrau für die Statistik
- Dunkelmodus, Login-Bildschirm, App-Icon und Statusleiste angepasst

## 2026-11-25 – Handy-Ansicht repariert
- Mealprep-Liste und „Zuletzt“-Zeilen liefen über den Bildschirmrand (Text wurde nicht umgebrochen)
- Plan: auf schmalen Bildschirmen steht der Übungsname jetzt über Sätzen/Wdh. statt sich mit den Feldern zu überlappen
- Seite kann nicht mehr seitlich über den Bildschirm hinausragen

## 2026-11-25 – Whey in der Ernährung
- Beispieltag: Snack ist jetzt ein Whey-Shake mit Milch & Banane (≈ 360 kcal, 33 g Eiweiß)
- Neues Rezept „Whey-Shake“, Protein-Pancakes mit 30 g Whey, Protein-Bällchen mit Whey
- Einkaufsliste und Mealprep-Plan angepasst (Whey ca. 250 g/Woche, mehr Milch, weniger Quark)

## 2026-11-25 – Aufbau
- PWA mit Trainingslog, Wochenstatistik pro Muskelgruppe, Push/Pull/Legs-Plan, Ernährung, Mealprep
- Login & Synchronisierung über Supabase (`gymlog_state`), offline-fähig
- Wasser-Tracker, Push-Erinnerungen (Edge Function `water-reminder`, minütlich per pg_cron)
- Mehrere Erinnerungsarten + eigene Erinnerungen, neue Übungen direkt im Plan, Drag & Drop
- Muskelgruppen Adduktoren/Abduktoren, Bulgarian Split Squat
- Fix: Ernährungsrechner speicherte Eingaben nicht
