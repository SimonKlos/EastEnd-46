# Versionen

Vor jeder Änderung wird der bisherige Stand der Website hier als eigener Ordner abgelegt.
Die aktuelle Version liegt immer im Hauptverzeichnis (`index.html`, `impressum.html`, `datenschutz.html`, `styles.css`, `script.js`, `config.js`) und wird von Vercel ausgeliefert.

Die Ordner enthalten nur den Code (HTML/CSS/JS), keine Schriften oder Videos. Sie dienen zum Vergleichen, nicht zum Anschauen im Browser.

| Version | Stand | Was sich danach geändert hat |
|---|---|---|
| `v1/` | Institutioneller One-Pager (Commit `09ba011`) | v2: Impressum- und Datenschutzseite mit Demo-Hinweis angelegt und im Footer sowie beim Einwilligungshaken verlinkt; „Seit 2024“ aus dem Hero entfernt; Hinweis „Webhook-ready · n8n“ entfernt. |
| `v2/` | Mit Impressum und Datenschutz (Commit `393ff28`) | v3: Neues, detaillierteres Kompass-Logo (Windrose mit Skalenring, 16 Spitzen, Ost-Spitze in Messing) in Header und Footer aller Seiten; Favicon ergänzt; Logo-Dateien unter `assets/logo/` abgelegt. |
| `v3/` | Mit neuem Kompass-Logo (Commit `3ee6600`) | v4: Kontaktformular um optionalen Anhang (max. 2 MB, PDF/Office/JPG/PNG) erweitert und auf `multipart/form-data` umgestellt, Fehlermeldungen vom Webhook werden angezeigt; Datenschutzerklärung um Anhänge, n8n, Notion und KI-Vorsortierung ergänzt. |
| `v4/` | Mit Anhang im Kontaktformular (Commit `a9f8d54`) | v5: Leistungstext Beratung neu ausgerichtet (Strategie, Finanzierung, Übernahmen & Zusammenschlüsse statt Transformation); Beteiligung nennt etablierte und wachsende Unternehmen. |
| `v5/` | Neuer Beratungsfokus (Commit `0099ba7`) | v6: Production-Webhook-URL von n8n in `config.js` eingetragen; Unternehmen ist jetzt Pflichtfeld (nur der Anhang bleibt optional); Datenschutzerklärung um Perplexity ergänzt; importierbare n8n-Dateien entfernt, das README beschreibt den geplanten Workflow. |

Unterschiede ansehen, zum Beispiel:

```bash
diff versions/v1/index.html index.html
```
