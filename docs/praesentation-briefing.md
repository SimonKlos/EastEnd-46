# Briefing für Claude Design: Executive-Präsentation „EastEnd46 – Stand und Weg zum Go-live“

**Format:** 3 Folien, 16:9, Deutsch, für ein Gespräch mit dem Ansprechpartner der Gesellschaft. Ruhig, hochwertig, wenig Text, keine Personennamen.

## Designsystem (wie die Website)

| Element | Vorgabe |
|---|---|
| Hintergrund | Weiß `#ffffff`; Titelfolie oder Akzentfläche dunkel `#172731` |
| Text | Dunkel `#172731`, Fließtext `#33434d` |
| Akzent | Marineblau `#173d5a` (auf Weiß), auf dunklen Flächen helles Grau `#dbe1e5` |
| Linien | `#d6dde1`, 1 px, gern als feine Trennlinien |
| Überschriften | **Cormorant** (Serif), Light 300, groß, enges Tracking; einzelne Wörter kursiv im Akzentton (wie „Substanz, *die bleibt.*“) |
| Fließtext und Labels | **DM Sans**. Kleine Labels in Versalien mit weiter Laufweite (z. B. „01 · STAND HEUTE“) |
| Logo | Kompass-Marke mit Schriftzug „EastEnd46“, Dateien im Repo unter `assets/logo/` (`eastend46-logo-dark.png` auf hellem, `eastend46-logo-light.png` auf dunklem Grund) |
| Stil | Viel Weißraum, nummerierte Abschnitte (01, 02, 03), keine Icons im Comic-Stil, keine Verläufe, keine Stockfotos. Optional die Frankfurter Skyline aus `assets/skyline-poster.webp` als dezentes Titelbild |

## Folie 1: Stand heute

**Label:** 01 · STAND HEUTE
**Titel:** Website und Anfragen-Workflow *stehen.*

**Linke Spalte – Website**
- Hochwertiger Auftritt unter dem Namen EastEnd46
- Beratung: Strategie, Finanzierung, Übernahmen und Zusammenschlüsse
- Beteiligung: etablierte und wachsende Unternehmen
- Bewusst keine Angaben zu Personen

**Rechte Spalte – Intelligentes Kontaktformular**
- Ein KI-Agent bewertet jede Anfrage: Kategorie, Priorität, Zusammenfassung, nächster Schritt
- Pitch Decks als PDF werden mitgelesen und abgelegt
- Jede Anfrage wird dokumentiert, nichts geht verloren
- Bei hoher Priorität: sofortige E-Mail an die Geschäftsführung

**Fußzeile/Kennzahl-Leiste:** „Getestet mit Beispielanfragen · 100 % dokumentiert · E-Mail nur bei hoher Priorität“

*Visual-Idee:* schlanke Prozesskette in fünf Schritten mit feinen Linien: Anfrage → Prüfung → KI-Bewertung → Dokumentation → Benachrichtigung.

## Folie 2: Weg zum Go-live

**Label:** 02 · NÄCHSTE SCHRITTE
**Titel:** In drei Wochen *live.*

Zeitstrahl mit vier Stationen:

| Phase | Zeitraum | Inhalt |
|---|---|---|
| **Identität** | Woche 1 | Domain eastend46.de, E-Mail info@eastend46.de, Firmenkonten mit Passwortmanager |
| **Umzug** | Woche 2 | Website, Workflow und Daten von privaten Konten auf Konten der Gesellschaft übertragen, Zugangsdaten neu setzen |
| **Recht** | parallel | Impressum und Datenschutz finalisieren, Auftragsverarbeitungsverträge abschließen |
| **Go-live** | Woche 3 | Ende-zu-Ende-Test, Fehlerüberwachung, Backups, Domain öffentlich schalten, private Zugänge schließen |

**Hinweiszeile:** „Alle Konten, Daten und Rechte liegen nach dem Umzug bei EastEnd46.“

## Folie 3: Kosten und Entscheidungen

**Label:** 03 · KOSTEN & ENTSCHEIDUNGEN
**Titel:** Überschaubarer *Betrieb.*

Zwei Spalten im Vergleich:

| | **Schlank** (empfohlen) | **Komfort** |
|---|---|---|
| Betrieb | Eigener Server (Hostinger, EU) für Website und Workflow | Verwaltete Cloud-Dienste (n8n Cloud, Vercel) |
| Laufende Kosten | **ca. 20–40 € / Monat** | **ca. 70–85 € / Monat** |
| Enthalten | Domain, E-Mail, Server, KI-Nutzung, Recherche | wie links, plus Notion Plus und Google Workspace |

**Kleingedruckt:** KI-Kosten nutzungsabhängig, ca. 0,15–0,20 € pro Anfrage. Optional für Pflege und Weiterentwicklung ein KI-Abo (ca. 20–25 € pro Monat). Einmalig 2–3 Tage Einrichtung.

**Block „Heute zu entscheiden“** (drei kurze Punkte, Akzentfarbe):
1. Go für den Go-live?
2. Betriebsmodell: Schlank oder Komfort?
3. Wer ist Kontoinhaber und Empfänger der Anfragen?

## Hinweise für die Umsetzung
- Maximal 40 Wörter Fließtext pro Spalte. Lieber eine Zeile streichen als die Schrift verkleinern.
- Zahlen als Spannen darstellen, nicht als Festpreise.
- Ausführlicher Hintergrund mit allen Schritten und Quellen: `docs/go-live-plan.md`.
