# Gymlog

Persönliche Trainings-App (PWA) für einen Push/Pull/Legs-Split:

- Trainings eintragen (Gewicht × Wiederholungen pro Satz, mit Werten vom letzten Mal)
- Wochenstatistik: Sätze pro Muskelgruppe mit Zielbereich 10–20
- Trainingsplan zum Anpassen, Kalender-Erinnerungen als .ics
- Ernährungsrechner, Mealprep-Rezepte, Einkaufsliste
- Login mit E-Mail/Passwort und Synchronisierung über Supabase (Tabelle `gymlog_state`, Row Level Security)
- Funktioniert offline: speichert lokal und gleicht ab, sobald wieder Internet da ist
- Backup-Export/-Import als Datei im Verlauf

## Installieren
Seite auf dem Handy öffnen, dann:
- **iPhone (Safari):** Teilen → „Zum Home-Bildschirm“
- **Android (Chrome):** Menü ⋮ → „App installieren“

## Updates
Nach Änderungen an `index.html` in `sw.js` die Versionsnummer (`gymlog-v1` → `gymlog-v2`) erhöhen.

## Technik
- Statische Seite auf GitHub Pages, kein Build-Schritt
- `vendor/supabase.js`: supabase-js 2.119.0 (MIT-Lizenz), lokal eingebunden für Offline-Betrieb
- Der Supabase-Publishable-Key in `index.html` ist öffentlich gedacht; den Secret-/service_role-Key niemals hier eintragen
