# Ideen & Vorschläge

Regeln für die täglichen Durchläufe:
- **A – ohne Design-Änderung:** darf direkt umgesetzt werden (Logik, Fehler, Tests, Code-Struktur,
  kleine Funktionen, die nur vorhandene Elemente/Stile nutzen und das Aussehen bestehender Bereiche nicht verändern).
- **B – Design:** alles, was Aussehen, Layout, Farben, Schriften, Anordnung verändert oder neue Bereiche/Karten/
  schwebende Elemente/Diagramme hinzufügt. Nur als Vorschlag beschreiben – umsetzen erst nach „Go“ von Livio.
  Freigegebene Vorschläge werden hier mit **FREIGEGEBEN** markiert.

## A – direkt umsetzbar
- [x] A1 (erledigt 2026-11-26) Steigerungs-Vorschlag beim Eintragen: Hat man letztes Mal in allen Sätzen das obere Ende des Wdh.-Bereichs geschafft, in der vorhandenen „Letztes Mal“-Zeile „→ heute X kg probieren“ ergänzen (+2,5 kg Grundübungen, +1 kg Isolation).
- [ ] A2 Automatische Tests (Puppeteer, headless Chrome): Speichern/Laden aller Eingaben, Training speichern, Statistik, Plan-Änderungen, Backup Export/Import.
- [ ] A3 Update-Hinweis: Wenn der Service Worker eine neue Version findet, im vorhandenen Hinweis-Stil („msg“) „Neue Version – tippen zum Aktualisieren“ anzeigen.
- [ ] A4 Robustheit: ~~Eingaben validieren (negative/absurde Werte)~~ (erledigt 2026-11-26), ~~Datum in der Zukunft~~ (erledigt 2026-11-27), offen: Fehler bei Sync sichtbar machen.
- [x] A6 (erledigt 2026-11-27) Steigerungs-Vorschlag auch in der Übersicht unter „Als Nächstes“ in der vorhandenen „Zuletzt:“-Zeile anzeigen.
- [x] A8 (erledigt 2026-11-28) Pausen-Timer: Mitteilung aufs Handy, wenn die Pause vorbei ist und die App im Hintergrund/gesperrt ist (über die vorhandene Push-Berechtigung).
- [ ] A7 Eigene Übungen als Grund- oder Isolationsübung markieren (bestimmt +2,5 kg bzw. +1 kg beim Steigerungs-Vorschlag; aktuell immer +1 kg).
- [ ] A9 Synchronisierung: Einstellungen/Plan feldweise zusammenführen statt „neuere Seite gewinnt alles“ (Wasser wird seit 2026-11-27 schon pro Tag zusammengeführt).
- [ ] A5 Code in mehrere Dateien aufteilen (ohne Build-Schritt, ES-Module), Verhalten unverändert.

## B – braucht Go (Design)
- [x] B1 **FREIGEGEBEN** – erledigt 2026-11-27: Fortschritts-Diagramm pro Übung (geschätztes Max. / schwerster Satz über Zeit) auf der Statistik-Seite.
- [x] B2 **FREIGEGEBEN** – erledigt 2026-11-26: Pausen-Timer nach jedem Satz (schwebende Leiste mit Countdown, Vibration).
- [ ] B3 Persönliche Rekorde mit kleiner Meldung.
- [ ] B4 Körpergewicht-Tracker mit Wochenschnitt und Kalorien-Anpassung.
- [ ] B5 Eiweiß-Zähler mit Schnell-Buttons für die Mealprep-Gerichte.
- [ ] B7 Datum im Training sichtbarer: Steht ein anderes Datum als heute im Feld, darunter ein kleiner Hinweis „Nicht heute – richtig?“ mit Knopf „Heute“.
- [ ] B6 Steigerungs-Vorschlag hervorheben: „→ heute 82,5 kg“ als kleines farbiges Etikett (Akzentfarbe) statt grauer Text, und auf Tippen das Gewicht in alle Sätze übernehmen.

## Später – niedrige Priorität (Prio 5, NICHT selbst umsetzen)
Diese Punkte erst angehen, wenn alle A-Punkte erledigt und alle B-Vorschläge umgesetzt oder von Livio abgelehnt sind.
Dann NICHT umsetzen, sondern Livio in der Zusammenfassung einmal fragen, ob er sie jetzt möchte (Wunsch vom 2026-11-27).
- [ ] P5-1 Kalorien-Tracker: Mahlzeiten/Kalorien über den Tag eintragen (passend zum Tagesziel aus dem Ernährungsrechner, Schnell-Einträge für die Mealprep-Gerichte).
  Push-Erinnerung um 09:00, 12:00, 15:00 und 18:00 Uhr: „Hast du schon alle Kalorien eingetragen?“ (über die vorhandene Edge Function, als neue Erinnerungsart unter Plan & Erinnerung ein-/ausschaltbar).
  Hinweis: überschneidet sich mit B5 (Eiweiß-Zähler) – gemeinsam planen.
