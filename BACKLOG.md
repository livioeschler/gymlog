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
- [ ] A4 Robustheit: ~~Eingaben validieren (negative/absurde Werte)~~ (erledigt 2026-11-26), offen: Datumsgrenzen (Datum in der Zukunft), Fehler bei Sync sichtbar machen.
- [ ] A6 Steigerungs-Vorschlag auch in der Übersicht unter „Als Nächstes“ in der vorhandenen „Zuletzt:“-Zeile anzeigen.
- [ ] A8 Pausen-Timer: Mitteilung aufs Handy, wenn die Pause vorbei ist und die App im Hintergrund/gesperrt ist (über die vorhandene Push-Berechtigung).
- [ ] A7 Eigene Übungen als Grund- oder Isolationsübung markieren (bestimmt +2,5 kg bzw. +1 kg beim Steigerungs-Vorschlag; aktuell immer +1 kg).
- [ ] A5 Code in mehrere Dateien aufteilen (ohne Build-Schritt, ES-Module), Verhalten unverändert.

## B – braucht Go (Design)
- [ ] B1 Fortschritts-Diagramm pro Übung (Gewicht/geschätztes 1RM über Zeit).
- [x] B2 **FREIGEGEBEN** – erledigt 2026-11-26: Pausen-Timer nach jedem Satz (schwebende Leiste mit Countdown, Vibration).
- [ ] B3 Persönliche Rekorde mit kleiner Meldung.
- [ ] B4 Körpergewicht-Tracker mit Wochenschnitt und Kalorien-Anpassung.
- [ ] B5 Eiweiß-Zähler mit Schnell-Buttons für die Mealprep-Gerichte.
- [ ] B6 Steigerungs-Vorschlag hervorheben: „→ heute 82,5 kg“ als kleines farbiges Etikett (Akzentfarbe) statt grauer Text, und auf Tippen das Gewicht in alle Sätze übernehmen.
