# EastEnd46 — Demo-Website

Pitch-tauglicher One-Pager für die EastEnd46 Beratungs- und Beteiligungsgesellschaft.

## Lokal starten

```bash
python3 -m http.server 4173
```

Dann `http://localhost:4173` öffnen.

## Skyline-Video einsetzen

Den aktuell hochgeladenen Clip bitte in diesem Pfad ablegen:

```text
assets/video/assetsvideoskyline.mp4.mp4
```

Der Dateiname ist ungewöhnlich, aber im HTML exakt so eingebunden.

## Kontaktformular mit n8n

Die Webhook-Konfiguration liegt zentral in `config.js`:

```js
window.EASTEND_CONFIG = {
  webhookUrl: 'https://DEIN-N8N-HOST/webhook/eastend46-contact'
};
```

Das Formular sendet per `POST` **`multipart/form-data`** an n8n (kein JSON, damit ein Anhang mitgeschickt werden kann). Felder:

| Feld | Inhalt |
|---|---|
| `name` | Pflicht |
| `company` | optional |
| `email` | Pflicht |
| `topic` | `Beratung` \| `Beteiligung` \| `Sonstiges` |
| `message` | Pflicht |
| `consent` | `on` |
| `source` | `eastend46-website` |
| `submittedAt` | ISO-8601-Zeitstempel |
| `attachment` | optionale Datei: PDF, DOCX, XLSX, PPTX, JPG oder PNG, max. 2 MB (wird im Browser geprüft, muss in n8n erneut geprüft werden) |

Das Honeypot-Feld `website` wird nicht mitgesendet. In n8n liegen die Textfelder unter `$json.body.*` und die Datei als Binärdaten unter `attachment`.

Die Website erwartet als Antwort JSON: `{ "ok": true }` bei Erfolg oder Status 400 mit `{ "ok": false, "error": "…" }`. Der Fehlertext wird dem Besucher direkt angezeigt.

Im n8n Webhook-Node sollten `POST` und `Response: Using 'Respond to Webhook' Node` aktiviert werden. Für eine produktive Website zusätzlich CORS auf die Vercel-Domain begrenzen und die Validierung im n8n-Workflow wiederholen. Die URL ist absichtlich in einer separaten Datei, damit sie ohne Änderung am Formular ausgetauscht werden kann.

## Lizenzfreie Footage-Quellen

Vor Verwendung die konkrete Clip-Lizenz prüfen:
- [Pexels Videos](https://www.pexels.com/videos/) — Pexels-Lizenz, Attribution in der Regel nicht erforderlich.
- [Mixkit](https://mixkit.co/free-stock-video/) — Clip- und Nutzungslizenz je Asset prüfen.
- [Coverr](https://coverr.co/) — kostenlose Stock-Video-Lizenz, konkrete Bedingungen prüfen.
- [Videvo](https://www.videvo.net/) — je nach Clip unterschiedliche Lizenz/Attribution.
- [Pixabay Videos](https://pixabay.com/videos/) — Pixabay Content License, konkrete Asset-Bedingungen prüfen.

Keine Zahlen, Kunden, Renditen oder Track-Records sind erfunden; Inhalte sind bewusst generisch gehalten.

## Versionen

Vor jeder Änderung wird der vorherige Code-Stand unter `versions/vN/` abgelegt (siehe `versions/README.md`). Die aktuelle Fassung liegt immer im Hauptverzeichnis und wird von Vercel ausgeliefert.

## Logo

Die Logo-Dateien liegen in `assets/logo/`:

- `eastend46-mark.svg`: Kompass-Marke als Vektor (auch Favicon)
- `eastend46-mark-dark.png` / `eastend46-mark-light.png`: Marke für helle bzw. dunkle Hintergründe
- `eastend46-logo-dark.png` / `eastend46-logo-light.png`: Marke mit Schriftzug für helle bzw. dunkle Hintergründe
