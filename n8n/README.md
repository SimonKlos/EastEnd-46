# n8n: Kontaktanfragen

Workflow für das Kontaktformular der Website:

1. Die Website sendet eine Anfrage an den Webhook.
2. Der Workflow prüft die Anfrage und antwortet der Website sofort.
3. Claude bewertet die Anfrage: Kategorie, Priorität, Spam, Zusammenfassung.
4. Jede Anfrage wird in Notion gespeichert, ein Anhang ebenfalls.
5. Anfragen mit Priorität **Hoch**, die kein Spam sind, gehen als formatierte E-Mail an den Owner.

| Datei | Zweck |
|---|---|
| `eastend46-kontaktformular.json` | Haupt-Workflow zum Importieren |
| `eastend46-notion-setup.json` | Einmal-Workflow, der die Notion-Datenbank mit allen Spalten anlegt |
| `builder-prompt.txt` | Derselbe Workflow als Prompt für die n8n-KI (unter 5000 Zeichen), falls er dort neu gebaut werden soll |

## Einrichtung

### 1. Zugangsdaten in n8n anlegen

- **Notion:** unter [notion.so/profile/integrations](https://www.notion.so/profile/integrations) eine interne Integration anlegen. In n8n die Zugangsdaten *Notion API* mit dem „Internal Integration Secret“ anlegen.
- **Anthropic:** einen API-Key in der [Claude Console](https://console.anthropic.com/) erzeugen. In n8n die Zugangsdaten *Anthropic API* anlegen.
- **Gmail:** in n8n die Zugangsdaten *Gmail OAuth2* anlegen und mit dem Absender-Postfach verbinden.

### 2. Notion-Datenbank anlegen

1. In Notion eine leere Seite anlegen, z. B. „EastEnd46 CRM“. Über **… → Verbindungen** die Integration hinzufügen.
2. `eastend46-notion-setup.json` in n8n importieren (**Workflow → Import from File**).
3. Im Node **Seite** die Seiten-ID eintragen. Das sind die 32 Zeichen am Ende des Seiten-Links.
4. Im Node **Datenbank anlegen** die Notion-Zugangsdaten auswählen und den Workflow einmal ausführen.
5. Der Node **Ergebnis** zeigt die `notionDatabaseId`. Diese ID kopieren.

### 3. Haupt-Workflow importieren

1. `eastend46-kontaktformular.json` importieren.
2. Im Node **Einstellungen** eintragen:
   - `notionDatabaseId`: die ID aus Schritt 2
   - `ownerEmail`: Empfänger der E-Mails
   - `websiteUrl`: die Vercel-Domain, z. B. `https://eastend46.vercel.app`. Dann erscheint das Logo in der E-Mail, leer bleibt der Schriftzug.
   - `anthropicModel`: vorbelegt mit `claude-sonnet-5`
3. Zugangsdaten zuweisen. Die Nodes sind nach dem Import rot markiert:
   - Notion in *Notion: Upload anlegen*, *Notion: Datei senden* und *Notion: Seite erstellen*
   - Anthropic in *Claude: Anfrage bewerten*
   - Gmail in *Gmail: mit Anhang* und *Gmail: ohne Anhang*
4. Im Node **Webhook** unter *Allowed Origins* die Website-Domain eintragen, statt `*`.
5. Workflow aktivieren. Die **Production URL** des Webhooks in `config.js` der Website eintragen.

## Testen

```bash
curl -X POST "https://<n8n-host>/webhook/eastend46-contact" \
  -F name="Max Beispiel" -F company="Beispiel Maschinenbau GmbH" -F email="max@example.com" \
  -F topic="Beteiligung" -F consent=on -F source=test \
  -F message="Wir sind ein Familienunternehmen mit 80 Mitarbeitenden und suchen für die Nachfolge einen langfristigen Partner." \
  -F attachment=@pitch.pdf
```

Erwartet wird die Antwort `{"ok":true}`, ein neuer Eintrag in Notion mit Anhang und eine E-Mail an den Owner. Ein Werbeangebot („Wir bringen Ihre Website auf Platz 1 bei Google …“) sollte als Spam gespeichert werden und keine E-Mail auslösen.

## Hinweise

- **Claude** wird per HTTP-Request direkt über die API angesprochen, nicht über den Chat-Model-Node. Sonnet 5 lehnt den Parameter `temperature` ab, den der Chat-Model-Node mitsenden kann. Das Antwortformat ist per JSON-Schema festgelegt (`output_config.format`).
  - Taucht *Anthropic API* im HTTP-Node nicht als vordefinierte Zugangsart auf, stattdessen *Header Auth* mit dem Namen `x-api-key` und dem API-Key verwenden.
- **PDFs und Bilder** liest Claude mit. Word-, Excel- und PowerPoint-Dateien werden nur gespeichert und weitergeleitet.
- **Fällt die KI aus**, wird die Anfrage trotzdem gespeichert, mit Status „Manuell prüfen“. Scheitert der Datei-Upload nach Notion, wird der Eintrag ohne Datei angelegt, mit einem Hinweis im Seiteninhalt.
- **Wechsel auf Outlook:** die beiden Gmail-Nodes durch *Microsoft Outlook → Send Message* ersetzen. Empfänger, Betreff, HTML und Anhang (`attachment`) bleiben gleich.
- Der Systemprompt für Claude steht im Code-Node **KI-Anfrage bauen**, die Regeln für die E-Mail im Node **Auswertung** (`notify`).
