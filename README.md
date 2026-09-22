# EastEnd46 — Demo-Website

Pitch-tauglicher One-Pager für die EastEnd46 Beratungs- und Beteiligungsgesellschaft.

## Lokal starten

```bash
python3 -m http.server 4173
```

Dann `http://localhost:4173` öffnen.

## Skyline-Video einsetzen

Den echten, lizenzierten Clip unter `assets/video/skyline.mp4` ablegen. Der HTML-Code enthält den markierten `SWAP-SLOT`; bis dahin zeigt der Poster-Fallback eine stilisierte Skyline.

## Kontakt-Webhook

In `script.js` die Konstante `WEBHOOK_URL` setzen. Leer = Demo-Erfolg ohne Versand. Gesetzt = JSON-POST mit `name`, `company`, `email`, `topic`, `message`, `consent`.

## Lizenzfreie Footage-Quellen

Vor Verwendung die konkrete Clip-Lizenz prüfen:
- [Pexels Videos](https://www.pexels.com/videos/) — Pexels-Lizenz, Attribution in der Regel nicht erforderlich.
- [Mixkit](https://mixkit.co/free-stock-video/) — Clip- und Nutzungslizenz je Asset prüfen.
- [Coverr](https://coverr.co/) — kostenlose Stock-Video-Lizenz, konkrete Bedingungen prüfen.
- [Videvo](https://www.videvo.net/) — je nach Clip unterschiedliche Lizenz/Attribution.
- [Pixabay Videos](https://pixabay.com/videos/) — Pixabay Content License, konkrete Asset-Bedingungen prüfen.

Keine Zahlen, Kunden, Renditen oder Track-Records sind erfunden; Inhalte sind bewusst generisch gehalten.
