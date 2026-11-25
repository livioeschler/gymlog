# Änderungsprotokoll

Neueste Einträge oben. Jeder tägliche Verbesserungs-Durchlauf ergänzt hier einen Abschnitt.

## 2026-11-25 – Aufbau
- PWA mit Trainingslog, Wochenstatistik pro Muskelgruppe, Push/Pull/Legs-Plan, Ernährung, Mealprep
- Login & Synchronisierung über Supabase (`gymlog_state`), offline-fähig
- Wasser-Tracker, Push-Erinnerungen (Edge Function `water-reminder`, minütlich per pg_cron)
- Mehrere Erinnerungsarten + eigene Erinnerungen, neue Übungen direkt im Plan, Drag & Drop
- Muskelgruppen Adduktoren/Abduktoren, Bulgarian Split Squat
- Fix: Ernährungsrechner speicherte Eingaben nicht
