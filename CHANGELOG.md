# Änderungsprotokoll

Neueste Einträge oben. Jeder tägliche Verbesserungs-Durchlauf ergänzt hier einen Abschnitt.

## 2026-11-28 – Grundübungen bei eigenen Übungen, Sync-Fehler sichtbar
- Neue eigene Übung im Plan kann als „Grundübung (schwer, mehrgelenkig)“ markiert werden: Steigerungs-Vorschlag +2,5 kg statt +1 kg und Pausen-Timer mit der langen Pause (A7). Bestehende eigene Übungen bleiben unverändert (Isolation)
- Schlägt die Synchronisierung fehl, steht im Konto-Bereich „Synchronisierung fehlgeschlagen“ mit Uhrzeit und Grund (z. B. keine Verbindung, Anmeldung abgelaufen); die App versucht es automatisch erneut (15 s, 30 s, 1 min … höchstens alle 5 min) statt erst beim nächsten Öffnen (A4)
- Service-Worker-Cache auf gymlog-v28

## 2026-11-28 – Pausen-Timer auch bei gesperrtem Handy
- Beim Verlassen der App während einer Pause erscheint eine Mitteilung „Pause läuft – bis HH:MM:SS“ auf dem Sperrbildschirm
- Pausen-Ende wird an Supabase gemeldet (Tabelle `rest_timers`); die Edge Function `water-reminder?rest=1` schickt eine Push-Mitteilung mit Ton genau zum Ende (pg_cron alle 10 s, ruft die Funktion nur auf, wenn ein Timer gleich endet)
- Setup: supabase/setup-rest-timer.sql + Funktion neu deployen

## 2026-11-28 – App startet auf der Startseite
- Ältere Installationen hatten noch die Statistik als Start-Adresse gespeichert; beim Öffnen wird jetzt immer die Startseite gezeigt

## 2026-11-27 – Fortschritts-Diagramm pro Übung (B1, freigegeben)
- Neue Karte „Fortschritt pro Übung“ auf der Statistik-Seite unter den Muskelgruppen
- Übung wählen (sortiert nach zuletzt trainiert; startet mit der Übung des nächsten Trainingstags), Anzeige „Geschätztes Max.“ (1-Wdh.-Maximum nach Epley aus Gewicht × Wdh.) oder „Schwerster Satz“, Zeitraum 3 Monate / 6 Monate / Alles
- Kennzahlen: aktuell, Bestwert, Veränderung seit Beginn bzw. im Zeitraum, Anzahl Trainings
- Linien-Diagramm mit einer Linie; Tippen/Darüberfahren zeigt Datum und alle Sätze des Trainings; „Als Tabelle“ zum Aufklappen
- Körpergewichtsübungen inkl. Körpergewicht; Auswahl wird pro Gerät gemerkt
- Service-Worker-Cache auf gymlog-v25

## 2026-11-27 – Fix: Trainingsdatum, Steigerung in der Übersicht, sicherere Synchronisierung
- **Fehler behoben:** Ein neues Training bekam das Datum des *vorherigen* Trainings, wenn man das Datumsfeld nicht anfasste (der Entwurf wurde direkt nach dem Speichern angelegt und behielt dieses Datum). Folgen waren falsche Wochenstatistik, falsche „Letztes Mal“-Daten und eine fälschliche Erinnerung „Training nicht eingetragen“. Jetzt gilt automatisch das heutige Datum, solange noch nichts eingetragen und das Datum nicht bewusst geändert wurde – auch wenn die App über Nacht offen war
- Training mit Datum in der Zukunft wird nicht gespeichert, sondern mit Hinweis angehalten (A4)
- Pausen-Timer wird beim Speichern des Trainings beendet (zeigte sonst noch eine Übung des gespeicherten Trainings an)
- Übersicht „Als Nächstes“: Steigerungs-Vorschlag auch in der „Zuletzt:“-Zeile, z. B. „→ heute 82,5 kg probieren“ (A6)
- Synchronisierung: Wasser-Einträge von zwei Geräten werden zusammengeführt statt dass die ältere Seite ganz verworfen wird
- Abmelden entfernt auch die zwischengespeicherten Garmin-Aktivitäten vom Gerät
- Service-Worker-Cache auf gymlog-v24

## 2026-11-27 – Startseite, Menü und Laufen (Garmin)
- Neue Startseite: nächster Gym-Tag, Wochenstand (inkl. gelaufene km), Wasser mit Schnell-Buttons, letzter Lauf
- Navigation über ☰-Menü oben links (Start, Training, Statistik, Laufen, Verlauf, Plan & Erinnerung, Ernährung); untere Leiste entfernt
- Neue Seite „Laufen“: Aktivitäten aus Garmin (Personal API) mit km/Woche, km/Monat, Ø Pace, Liste mit Dauer/Pace/Puls/Höhenmetern, Route auf Karte (OpenStreetMap, offline als Linie)
- Neue Edge Function `garmin-sync` + Tabelle `garmin_activities` (supabase/setup-garmin.sql)

## 2026-11-26 – Whey in den Overnight Oats
- Overnight Oats mit 15 g Whey pro Glas (+50 ml Milch): ≈ 620 kcal, 56 g Eiweiß; Beispieltag und Einkaufsliste angepasst

## 2026-11-26 – Pausen-Timer (B2, freigegeben)
- Sobald die Wiederholungen eines Satzes eingetragen sind, startet unten eine schwebende Leiste mit Countdown (über der Navigation am Handy)
- Standard: 2:30 Min. bei Grundübungen, 1:30 Min. bei Isolation – einstellbar unten im Training („Pause … (Sek.)“, 0 = aus), wird synchronisiert
- Zeigt, was danach kommt (z. B. „Bankdrücken, Satz 2“), Fortschrittsbalken, −15/+15 Sek., ✕ zum Schließen
- Am Ende: Vibration (Android) und kurzer Ton, Leiste färbt sich „Pause vorbei – nächster Satz!“ und verschwindet nach einer Minute
- Läuft über die Endzeit weiter, auch nach Neuladen oder wenn die App kurz im Hintergrund war
- Service-Worker-Cache auf gymlog-v20

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
