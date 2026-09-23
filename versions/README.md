# Versionen

Vor jeder Änderung wird der bisherige Stand der Website hier als eigener Ordner abgelegt.
Die aktuelle Version liegt immer im Hauptverzeichnis (`index.html`, `impressum.html`, `datenschutz.html`, `styles.css`, `script.js`, `config.js`) und wird von Vercel ausgeliefert.

Die Ordner enthalten nur den Code (HTML/CSS/JS), keine Schriften oder Videos. Sie dienen zum Vergleichen, nicht zum Anschauen im Browser.

| Version | Stand | Was sich danach geändert hat |
|---|---|---|
| `v1/` | Institutioneller One-Pager (Commit `09ba011`) | v2: Impressum- und Datenschutzseite mit Demo-Hinweis angelegt und im Footer sowie beim Einwilligungshaken verlinkt; „Seit 2024“ aus dem Hero entfernt; Hinweis „Webhook-ready · n8n“ entfernt. |
| `v2/` | Mit Impressum und Datenschutz (Commit `393ff28`) | v3: Neues, detaillierteres Kompass-Logo (Windrose mit Skalenring, 16 Spitzen, Ost-Spitze in Messing) in Header und Footer aller Seiten; Favicon ergänzt; Logo-Dateien unter `assets/logo/` abgelegt. |

Unterschiede ansehen, zum Beispiel:

```bash
diff versions/v1/index.html index.html
```
