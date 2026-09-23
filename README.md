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

## Kontaktformular und Anfragen-Workflow

Das Kontaktformular sendet jede Anfrage an einen Webhook in **n8n** (n8n Cloud). Die Production-URL steht in `config.js`:

```js
window.EASTEND_CONFIG = {
  webhookUrl: 'https://eintrachtfrankfurt.app.n8n.cloud/webhook/eastend46-contact'
};
```

Ist `webhookUrl` leer, zeigt das Formular nur einen Demo-Erfolg an und sendet nichts.

### So soll der Workflow funktionieren

Der Workflow ist in Arbeit und wird direkt in n8n gebaut. Geplant ist:

1. **Webhook** nimmt die Anfrage an und antwortet der Website sofort. Die Website wartet nicht auf die Bearbeitung.
2. **Ein KI-Agent** (Claude Sonnet 5 von Anthropic) liest die Anfrage:
   - ordnet sie einer Kategorie zu: Beteiligung, Strategie, Finanzierung, Übernahme & Zusammenschluss, Unternehmensnachfolge, Kooperation & Netzwerk, Bewerbung, Dienstleister & Vertrieb, Presse, Sonstiges oder Spam
   - erkennt Spam
   - vergibt eine Priorität (Hoch, Mittel, Niedrig) und eine Relevanz von 0 bis 100
   - schreibt eine Zusammenfassung und empfiehlt einen nächsten Schritt
3. Der Agent nutzt dabei drei Werkzeuge:
   - **Perplexity** recherchiert öffentliche Informationen zum anfragenden Unternehmen, nicht zu Privatpersonen.
   - **Notion** speichert jede Anfrage in der Datenbank „EastEnd46 · Anfragen“, auch Spam.
   - **Gmail** schickt nur bei Priorität **Hoch** und kein Spam eine formatierte Zusammenfassung an den Inhaber, mit Link zum Notion-Eintrag. Später wird Gmail durch ein Outlook-Postfach mit EastEnd46-Adresse ersetzt.

| Werkzeug | Aufgabe |
|---|---|
| n8n Cloud | Webhook und Ablauf |
| Anthropic Claude Sonnet 5 (`claude-sonnet-5`) | KI-Agent: Einordnung, Priorisierung, Zusammenfassung |
| Perplexity | Recherche zum Unternehmen |
| Notion | Datenbank aller Anfragen |
| Gmail (MVP), später Outlook | E-Mail an den Inhaber bei hoher Priorität |

**Anhänge:** Der Workflow verarbeitet Anhänge vorerst nicht. Der Agent sieht nur den Dateinamen. Wie PDFs später ausgelesen und in Notion abgelegt werden, steht in [`docs/plan-pdf-anhaenge.md`](docs/plan-pdf-anhaenge.md).

Hinweis: Sonnet 5 akzeptiert keine Sampling-Parameter. Im Anthropic-Chat-Model-Node deshalb `temperature`, `top_p` und `top_k` nicht setzen.

### Was die Website sendet

`POST` als **`multipart/form-data`**:

| Feld | Inhalt |
|---|---|
| `name` | Pflicht (im Formular mit * markiert) |
| `company` | Pflicht |
| `email` | Pflicht |
| `topic` | Pflicht: `Beratung` \| `Beteiligung` \| `Sonstiges` |
| `message` | Pflicht |
| `consent` | Pflicht: `on` |
| `source` | `eastend46-website` |
| `submittedAt` | ISO-8601-Zeitstempel |
| `attachment` | optional: eine PDF-Datei, max. 2 MB |

In n8n liegen die Textfelder unter `$json.body.*` und die Datei als Binärdaten unter `attachment`. Das Honeypot-Feld `website` wird nicht mitgesendet. Die Pflichtfelder und die Datei prüft die Website und zeigt freundliche Hinweise direkt am Feld. Nach dem Absenden erscheint eine Bestätigung auf der Seite (Häkchen-Animation, Hinweis, dass EastEnd46 sich bei passenden Anfragen meldet). Eine Bestätigungs-E-Mail an den Absender wird nicht verschickt. Weil der Webhook öffentlich erreichbar ist, sollte n8n sie noch einmal prüfen.

### Was die Website als Antwort erwartet

- Status 2xx: Erfolgsmeldung. Ein JSON-Body wie `{ "ok": true }` ist optional.
- Status 4xx/5xx oder `{ "ok": false, "error": "…" }`: Fehlermeldung. Ein mitgelieferter `error`-Text wird dem Besucher direkt angezeigt.

In n8n muss der Webhook **aktiv** sein, damit die Production-URL erreichbar ist. Unter *Allowed Origins (CORS)* muss die Website-Domain erlaubt sein, sonst blockiert der Browser die Antwort.

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
