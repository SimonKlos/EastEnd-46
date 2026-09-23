# Plan: PDF-Anhänge im Anfragen-Workflow (n8n)

**Status:** geplant, noch nicht umgesetzt. Der Workflow läuft zunächst ohne Anhangverarbeitung.

## Ziel

Schickt jemand über das Kontaktformular eine PDF mit, soll

1. der KI-Agent den **Inhalt der PDF lesen** und in seine Bewertung einbeziehen, und
2. die PDF **in Notion** in der Spalte „Anhang“ am Eintrag liegen.

Das Kontaktformular nimmt als Anhang nur PDF-Dateien an (max. 2 MB).

## Ausgangslage

- Die Website sendet den Anhang als Binärdatei `attachment`. Maximal 2 MB, geprüft im Browser.
- Der Code-Node **„Webhook Input“** prüft die Datei erneut und liefert:
  - `attachment` mit `fileName`, `mimeType`, `size` (oder `null`)
  - die Datei selbst als Binary `attachment`
- Der Agent sieht heute nur den Dateinamen. Er darf deshalb keine Aussagen über den Inhalt machen.

**Wichtig:** Der Agent kann Dateien nicht selbst hochladen. Tools bekommen vom Agenten nur Text, und der Notion-Node kann in einer Datei-Spalte nur Links eintragen. Deshalb lädt der Workflow die PDF **vor** dem Agenten zu Notion hoch. Der Agent hängt sie danach mit einem eigenen Tool an seinen Eintrag.

## Zielbild

```
Webhook → Webhook Input → IF „PDF-Anhang?“
                            ├─ true  → PDF auslesen → Notion Upload anlegen → Datei anhängen → Notion Datei senden → Agent
                            └─ false → Agent

Agent-Tools: Perplexity_Recherche · Notion_Anfrage_speichern · Notion_Anhang_anhaengen (neu) · Gmail_Inhaber_benachrichtigen
```

## Umsetzung Schritt für Schritt

### 1. IF-Node „PDF-Anhang?“

Direkt hinter „Webhook Input“ einfügen.

- Bedingung (String → *is equal to*): `{{ $json.attachment?.mimeType }}` = `application/pdf`
- Ohne Anhang ist der Wert leer. Die Anfrage geht dann über **false** direkt zum Agenten.

### 2. Extract from File „PDF auslesen“ (am true-Ausgang)

- Operation: **Extract From PDF**
- Input Binary Field: `attachment`
- Settings → On Error: **Continue**
- Ergebnis: der Text der PDF steht in `text`.

### 3. HTTP Request „Notion Upload anlegen“

- Method: `POST`
- URL: `https://api.notion.com/v1/file_uploads`
- Authentication: Predefined Credential Type → **Notion API**
- Header: `Notion-Version` = `2022-06-28`
- Body: JSON

```
{ "mode": "single_part", "filename": "{{ $('Webhook Input').first().json.attachment.fileName }}", "content_type": "application/pdf" }
```

- Settings → On Error: Continue

### 4. Code „Datei anhängen“

Die Antwort von Notion enthält die Datei nicht mehr. Dieser Node hängt sie wieder an:

```js
return [{ json: { uploadId: $json.id }, binary: $('Webhook Input').first().binary }];
```

### 5. HTTP Request „Notion Datei senden“

- Method: `POST`
- URL: `https://api.notion.com/v1/file_uploads/{{ $json.uploadId }}/send`
- Authentication: Notion API, Header `Notion-Version` = `2022-06-28`
- Body Content Type: **Form-Data**
  - Parameter Type: **n8n Binary File**
  - Name: `file`
  - Input Data Field Name: `attachment`
- Settings → On Error: Continue
- Die Antwort enthält bei Erfolg `"status": "uploaded"`.

Danach den Ausgang dieses Nodes **und** den false-Ausgang des IF mit dem Agenten verbinden.

Hochgeladene Dateien müssen innerhalb einer Stunde an einen Eintrag gehängt werden. Das passiert direkt im nächsten Schritt durch den Agenten.

### 6. Neues Agent-Tool: HTTP Request Tool „Notion_Anhang_anhaengen“

- Beschreibung: *„Hängt die hochgeladene PDF an einen Notion-Eintrag. Eingabe: die ID der Seite, die mit Notion_Anfrage_speichern angelegt wurde. Nur aufrufen, wenn in der Anfrage ‚PDF in Notion hochgeladen: ja‘ steht.“*
- Method: `PATCH`
- URL: `https://api.notion.com/v1/pages/{{ $fromAI('page_id', 'ID der eben angelegten Notion-Seite', 'string') }}`
- Authentication: Notion API, Header `Notion-Version` = `2022-06-28`
- Body: JSON

```
{ "properties": { "Anhang": { "files": [ { "type": "file_upload", "file_upload": { "id": "{{ $('Notion Datei senden').first().json.id }}" }, "name": "{{ $('Webhook Input').first().json.attachment.fileName }}" } ] } } }
```

- Zwischen schließenden Klammern `} }` immer ein Leerzeichen lassen. `}}` direkt hintereinander kann n8n als Ende eines Ausdrucks lesen.
- Die Notion-Spalte „Anhang“ muss vom Typ **Dateien & Medien** sein.

### 7. Prompt (User Message) des Agenten anpassen

Der Agent hat danach zwei mögliche Vorgänger. Alle Felder müssen deshalb auf den Code-Node zeigen, also `$('Webhook Input').first()` statt `$json`:

```
Bearbeite diese neue Kontaktanfrage von der EastEnd46-Website.

<anfrage>
Name: {{ $('Webhook Input').first().json.data.name }}
Unternehmen: {{ $('Webhook Input').first().json.data.company }}
E-Mail: {{ $('Webhook Input').first().json.data.email }}
Anliegen laut Formular: {{ $('Webhook Input').first().json.data.topic }}
Eingang: {{ $('Webhook Input').first().json.data.submittedAt }}
Anhang: {{ $('Webhook Input').first().json.attachment ? $('Webhook Input').first().json.attachment.fileName : 'kein Anhang' }}

Nachricht:
{{ $('Webhook Input').first().json.data.message }}

PDF in Notion hochgeladen: {{ $('Notion Datei senden').isExecuted && $('Notion Datei senden').first().json.status === 'uploaded' ? 'ja' : 'nein' }}

Inhalt des Anhangs (automatisch ausgelesen):
{{ $('PDF auslesen').isExecuted ? (($('PDF auslesen').first().json.text || '').trim().slice(0, 20000) || 'PDF enthält keinen auslesbaren Text (vermutlich eingescannt)') : 'kein PDF-Anhang' }}
</anfrage>
```

`slice(0, 20000)` begrenzt den PDF-Text auf 20.000 Zeichen. Das hält Kosten und Laufzeit im Rahmen.

### 8. System Message des Agenten ergänzen

Unter „Ablauf“ nach Schritt 3:

```
3b. Steht in der Anfrage „PDF in Notion hochgeladen: ja“, rufe direkt danach „Notion_Anhang_anhaengen“ mit der ID der gerade angelegten Seite auf (aus der Antwort von Notion_Anfrage_speichern).
```

Unter „Regeln“:

```
- Über den Inhalt eines Anhangs darfst du nur Aussagen machen, wenn unter „Inhalt des Anhangs“ Text steht. Sonst nenne nur den Dateinamen.
```

## Test

1. Anfrage **mit** kleiner PDF über das Formular senden. Im Agent-Log müssen `Notion_Anfrage_speichern` und direkt danach `Notion_Anhang_anhaengen` stehen. Die PDF liegt dann in Notion in „Anhang“, und die Zusammenfassung bezieht sich auf den PDF-Inhalt.
2. Anfrage **ohne** Anhang senden. `Notion_Anhang_anhaengen` darf nicht aufgerufen werden.
3. Eingescannte PDF senden. Der Agent sollte vermerken, dass kein Text auslesbar war, und keine Inhalte erfinden.

## Grenzen

| Anhang | Nach Umsetzung |
|---|---|
| PDF mit Text (z. B. exportiertes Pitch Deck, Zahlen-PDF) | wird gelesen und in Notion abgelegt |
| Eingescanntes PDF | wird in Notion abgelegt, Inhalt nicht lesbar |
| Diagramme in PDFs | nur Beschriftungen lesbar |

## Mögliche Erweiterungen

- **Einfachere Ablage:** statt Schritt 3 bis 6 die PDF per Google-Drive-Node hochladen und im Notion-Tool nur den Drive-Link in „Anhang“ eintragen. Das ist ein Node statt vier, dafür liegt die Datei in Google Drive.
- **Eingescannte PDFs und Diagramme lesen:** „PDF auslesen“ durch einen HTTP-Request an die Claude-API ersetzen. Claude liest PDFs inklusive Scans und Grafiken.
- **Datenschutz:** vor dem Livegang in der Datenschutzerklärung ergänzen, dass Anhänge in Notion gespeichert und von der KI ausgewertet werden.
