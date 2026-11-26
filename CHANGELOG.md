# Änderungsprotokoll

Neueste Einträge oben. Jeder tägliche Verbesserungs-Durchlauf ergänzt hier einen Abschnitt.

## 2026-11-26 – Steigerungs-Vorschlag beim Eintragen
- Wer letztes Mal in allen geplanten Sätzen das obere Ende des Wdh.-Bereichs geschafft hat, sieht in der „Letztes Mal“-Zeile „→ heute X kg probieren“ (+2,5 kg bei Grundübungen, +1 kg bei Isolationsübungen; bei Körpergewichtsübungen als Zusatzgewicht, z. B. „KG+12,5“)
- Schutz vor Tippfehlern: Training mit über 200 Wdh., über 1000 kg oder negativem Gewicht (außer Körpergewichtsübungen) wird nicht gespeichert, sondern mit Hinweis zur Prüfung angehalten
- Service-Worker-Cache auf gymlog-v19

## 2026-11-26 – Latissimus als eigene Muskelgruppe
- Neue Muskelgruppe „Latissimus“, „Rücken“ heißt jetzt „Oberer Rücken“
- Latzug, Klimmzüge, Kabelrudern eng: Latissimus voll, oberer Rücken halb; Langhantelrudern: oberer Rücken voll, Latissimus halb
- Neue Übung „Pullover (Kabel / Kurzhantel)“: Latissimus voll, Brust halb

## 2026-11-26 – Plan-Änderungen sofort im Training
- Der Trainings-Entwurf gleicht sich bei jeder Plan-Änderung (und beim Öffnen) mit dem Plan ab: neue Übungen erscheinen, entfernte verschwinden, Reihenfolge und Satzanzahl folgen dem Plan
- Bereits eingetragene Werte, im Training hinzugefügte Übungen und dort entfernte Übungen bleiben erhalten

## 2026-11-26 – Klimmzüge mit Körpergewicht
- „Latzug / Klimmzüge“ aufgeteilt in Latzug und Klimmzüge; im Plan wurde Latzug/Klimmzüge durch Klimmzüge ersetzt
- Körpergewichtsübungen (Klimmzüge, Dips, Beinheben hängend): Feld „+kg“ nur für Zusatzgewicht, Körpergewicht aus den Ernährungs-Einstellungen wird automatisch gerechnet; Anzeige z. B. „KG+10×5“
- Eigene Übungen können als Körpergewichtsübung markiert werden

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
