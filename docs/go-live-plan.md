# EastEnd46: Plan für den Go-live von Website und Anfragen-Workflow

Stand: Oktober 2026

## 1. Ausgangslage

**Was steht (Demo):**
- **Website** (One-Pager, Impressum, Datenschutz):
  - zurückhaltendes Design mit Marineblau, Weiß und Kompass-Logo
  - Bereiche Beratung, Beteiligung, Anspruch und Perspektiven
  - keine Angaben zu Personen
  - Hosting: Vercel, Vorschau-Link, nur für Personen mit Link
- **Kontaktformular:**
  - Pflichtfelder mit freundlichen Hinweisen
  - optionaler PDF-Anhang bis 2 MB
  - Bestätigungsanimation nach dem Absenden
- **Anfragen-Workflow** (n8n):
  - Webhook nimmt die Anfrage an und prüft sie.
  - Eine PDF wird ausgelesen und in Google Drive abgelegt.
  - Ein KI-Agent mit Claude Sonnet 5 bewertet die Anfrage: Kategorie, Priorität, Zusammenfassung, nächster Schritt. Für Recherche nutzt er Perplexity.
  - Jede Anfrage wird in Notion dokumentiert.
  - Bei Priorität „Hoch“ geht eine E-Mail an den Inhaber.
- Im Test durchgängig erfolgreich, auch mit einer Beispielanfrage samt Pitch Deck.

**Was noch fehlt, bevor es live gehen kann:**
- Es gibt **keine Domain** und **keine E-Mail-Adresse** der Gesellschaft. `info@eastend46.de` steht auf der Website, existiert aber noch nicht.
- Alle Dienste laufen über **private bzw. fremde Konten** und müssen auf EastEnd46 übertragen werden:

| Dienst | Aktuell |
|---|---|
| n8n | Instanz `eintrachtfrankfurt.app.n8n.cloud` |
| Gmail | privates Postfach |
| Google Drive | privates Konto |
| Notion | privater Workspace |
| Anthropic, Perplexity | private API-Keys |
| GitHub, Vercel | private Konten |

- **Rechtstexte** sind Demo-Versionen mit Platzhaltern: Rechtsform, Adresse, Geschäftsführung, Register, Auftragsverarbeitung.

## 2. Schritte zum Go-live

### Phase 0: Entscheidung (Termin heute)
- [ ] Go/No-Go für Website und Workflow
- [ ] Texte und Design freigeben (Perspektiven-Beiträge ja/nein)
- [ ] **Hosting-Variante** wählen: „Schlank“ (eigener Server) oder „Komfort“ (Cloud-Dienste), siehe Kosten unten
- [ ] Verantwortlich festlegen: Wer ist Inhaber der Konten, wer betreut technisch, wer bekommt die E-Mails?
- [ ] **Nutzungsrechte** an Code, Logo und Workflow regeln: kurze schriftliche Vereinbarung, dass EastEnd46 alles nutzen und ändern darf

### Phase 1: Identität und Konten der Gesellschaft (Woche 1)
- [ ] **Domain** `eastend46.de` registrieren, z. B. bei IONOS. Vorher prüfen, ob sie frei ist. Optional zusätzlich `eastend46.com`.
- [ ] **E-Mail-Postfach** einrichten, z. B. Hostinger Business E-Mail oder IONOS Mail:
  - `info@eastend46.de` als Kontaktadresse
  - optional `anfragen@` als Absender für die Benachrichtigungen
- [ ] **Passwortmanager** für die Gesellschaft (z. B. Bitwarden, 1Password). Alle Zugänge liegen dort, nicht bei Einzelpersonen.
- [ ] Firmenkonten anlegen, immer mit der neuen E-Mail-Adresse und Zwei-Faktor-Anmeldung:

| Konto | Zweck |
|---|---|
| GitHub (Organisation „eastend46“) | Quellcode der Website |
| Hosting (Hostinger VPS **oder** Vercel/Cloudflare) | Website und n8n |
| n8n (selbst gehostet auf dem VPS **oder** n8n Cloud) | Workflow |
| Anthropic Console | API-Key für Claude, Zahlungsmittel, Ausgabenlimit |
| Perplexity API | API-Key für die Recherche, Ausgabenlimit |
| Notion | Workspace der Gesellschaft mit der Anfragen-Datenbank |
| Google-Konto der Gesellschaft (oder Ablage auf dem Server) | Ablage der PDF-Anhänge |

### Phase 2: Umzug der Technik (Woche 2)
- [ ] GitHub-Repository an die Organisation **übertragen** (Settings → Transfer). Die Versionshistorie bleibt erhalten.
- [ ] Website beim gewählten Hoster einrichten und die **Domain verbinden**. SSL-Zertifikat aktivieren, `www` auf die Hauptdomain weiterleiten.
- [ ] n8n-Workflow **exportieren** (JSON) und in der neuen Instanz **importieren**.
- [ ] Im Workflow **alle Zugangsdaten neu anlegen** und zuweisen: Anthropic, Perplexity, Notion, Google Drive und E-Mail. Statt Gmail kommt das Firmenpostfach per SMTP oder der Outlook-Node.
- [ ] Notion-Datenbank in den Firmen-Workspace **duplizieren** und die Integration verbinden.
- [ ] Drive-Ordner „EastEnd46 Anfragen“ im Firmenkonto anlegen.
- [ ] Neue **Webhook-URL** in `config.js` eintragen. Im Webhook unter *Allowed Origins* nur die eigene Domain erlauben.
- [ ] Empfänger der Benachrichtigung auf die Adresse der Geschäftsführung umstellen.

### Phase 3: Recht und Inhalte (parallel zu Phase 1 und 2)
- [ ] **Impressum** vervollständigen: Rechtsform, Anschrift, Vertretung, Register, USt-ID.
- [ ] **Datenschutzerklärung** finalisieren:
  - Hoster, n8n, Anthropic, Perplexity, Notion, Google und E-Mail-Anbieter mit Sitz und Rechtsgrundlage nennen
  - US-Übermittlungen begründen
  - Speicherdauer festlegen
- [ ] **Auftragsverarbeitungsverträge** (AVV/DPA) mit allen Anbietern abschließen bzw. akzeptieren.
- [ ] Rechtstexte prüfen lassen (Anwalt oder Generator mit Haftung).
- [ ] Demo-Hinweise auf Impressum und Datenschutz entfernen.

### Phase 4: Test und Go-live (Woche 3)
- [ ] Ende-zu-Ende-Tests auf der echten Domain: Anfrage mit PDF, ohne PDF, Spam, ungültige Eingaben.
- [ ] Fehler-Benachrichtigung in n8n einrichten (Error Workflow → E-Mail), damit Ausfälle auffallen.
- [ ] Backups einrichten: Server-Snapshot, n8n-Workflow-Export, Notion-Export.
- [ ] Ausgabenlimits bei Anthropic und Perplexity setzen.
- [ ] Go-live: Domain öffentlich schalten, Vorschau-Link deaktivieren.
- [ ] **Alte Zugänge schließen:** private API-Keys widerrufen, private Gmail-, Drive- und Notion-Verbindungen aus dem Workflow entfernen, den Workflow auf der alten n8n-Instanz deaktivieren.

### Danach: Betrieb
- Monatlich prüfen: Anfragen in Notion durchgehen, Fehlermeldungen, API-Kosten.
- Ausbauideen: Antwortvorlagen, Wiedererkennung von Stammkontakten, Perspektiven-Beiträge, englische Version.

## 3. Laufende Kosten (Schätzung, Stand Oktober 2026)

Preise schwanken je nach Laufzeit und Aktion. Vor dem Kauf auf den Anbieterseiten prüfen.

| Posten | Schlank (eigener Server) | Komfort (Cloud-Dienste) |
|---|---|---|
| Domain `.de` (IONOS) | ca. 1 €/Monat (12–16 €/Jahr, 1. Jahr oft günstiger) | ca. 1 €/Monat |
| E-Mail (Hostinger Business, 1–2 Postfächer) | 3–6 € | 6–12 € |
| n8n | Hostinger VPS KVM 2, selbst gehostet: 7–12 € (+ ca. 5 € Backups) | n8n Cloud Starter: 20–24 € |
| Website-Hosting | auf dem VPS oder Cloudflare Pages: 0 € | Vercel Pro (Hobby ist für kommerzielle Nutzung nicht erlaubt): ca. 19 € |
| Notion | Free: 0 € | Plus: ca. 10–12 € pro Person |
| Ablage PDFs | Google-Konto (15 GB frei) oder Server: 0 € | Google Workspace: ca. 7 € |
| Claude API (Sonnet 5) | nutzungsabhängig, ca. 0,15–0,20 € pro Anfrage, bei 30–50 Anfragen ca. 5–10 € | ca. 5–10 € |
| Perplexity API | unter 1 € | unter 1 € |
| **Summe pro Monat** | **ca. 20–40 €** | **ca. 70–85 €** |

**Optional für Weiterentwicklung und Pflege**, pro Person: Claude Pro (enthält Claude Code) ca. 21 €/Monat, ChatGPT Plus ca. 23 €/Monat. Ein Abo reicht in der Regel.

**Einmalig:** Einrichtung und Umzug ca. 2–3 Arbeitstage, ggf. rechtliche Prüfung der Rechtstexte.

**Empfehlung:** „Schlank“ mit einem Hostinger VPS. n8n und Website laufen dort gemeinsam, die Daten liegen in der EU, und die Kosten bleiben planbar. „Komfort“ lohnt sich, wenn niemand einen Server betreuen möchte.

### Quellen der Preisangaben
- Domain: [l-iz.de – IONOS Preise 2026](https://www.l-iz.de/vpn/erfahrungen/ionos-preise/), [whtop.com – IONOS .de](https://www.whtop.com/de/plans/ionos.de/64360)
- E-Mail: [heise – Hostinger Business-E-Mail im Test](https://www.heise.de/download/specials/Hostinger-Business-E-Mail-im-Test-Profi-E-Mail-mit-KI-11200114), [Hostinger Preise E-Mail](https://www.hostinger.com/at/Preise/email-hosting)
- VPS: [websiterating.com – Self-Hosting n8n](https://www.websiterating.com/tools/how-to-self-host-n8n), [growwstacks.com – n8n auf Hostinger VPS](https://growwstacks.com/blog/how-to-self-host-n8n-hostinger-vps/)
- n8n Cloud: [jetadmin.io – n8n Pricing 2026](https://www.jetadmin.io/blog/n8n-pricing/), [toolradar.com – n8n Pricing 2026](https://toolradar.com/blog/n8n-pricing-2026)
- Vercel: [modelence.com – Vercel Pricing 2026](https://modelence.com/compare/vercel-pricing), [temps.sh – Vercel Pro 2026](https://temps.sh/blog/vercel-pricing-2026-pro-plan-explained)
- Notion: [aiproductivity.ai – Notion Pricing](https://aiproductivity.ai/blog/notion-pricing/), [automationatlas.io – Notion Pricing 2026](https://automationatlas.io/answers/notion-pricing-explained-2026/)
- Perplexity: [puter.com – Perplexity API Pricing](https://developer.puter.com/tutorials/perplexity-api-pricing/), [flexprice.io – Sonar API](https://flexprice.io/pricing-index/perplexity-sonar-api)
- Abos: [ki-spot.de – Claude Preise 2026](https://ki-spot.de/claude-preise/), [vodafone.de – ChatGPT Abo-Kosten 2026](https://www.vodafone.de/featured/digital-life/chatgpt-abo-kosten-vergleich/)
- Claude API: Sonnet 5 kostet 2 $ pro Mio. Input- und 10 $ pro Mio. Output-Tokens. Die Schätzung pro Anfrage beruht auf ca. 8.000 Tokens je Agent-Schritt bei mehreren Schritten, wie im Test beobachtet.
