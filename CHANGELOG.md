# Änderungsprotokoll

Neueste Einträge oben. Jeder tägliche Verbesserungs-Durchlauf ergänzt hier einen Abschnitt.

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
