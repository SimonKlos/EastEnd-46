/*
 * Arenas made for Germany — PowerPoint master
 *
 * Rebuilds the slide master of "2026.10.02 Workshop Arenas made for Germany"
 * (slides 4–9) with measured values. Slide canvas is 960 × 540 pt (13.333 × 7.5 in),
 * so every number below is in points, exactly as measured from the source PDF.
 *
 *   node build_master.js              -> Arenas_Master.pptx  (layouts + one slide per layout)
 *                                      -> Arenas_Beispiele.pptx (the source slides rebuilt on the master)
 *   python3 finalize.py                -> patches the master text styles and writes Arenas_Master.potx
 *
 * Edit CONFIG to change the agenda tracker, the footer authors or the deck title.
 */
const path = require("path");
const pptxgen = require("pptxgenjs");

const CONFIG = {
  deckTitle: "Workshop Arenas made for Germany",
  authors: "Axel Hellmann, Philipp Heßberger",
  // Agenda tracker tabs (top left). Max 4 per the source; "\n" forces the 2-line break used there.
  chapters: [
    "1. Ausgangslage &\nZielbild",
    "2. Herausforderung &\nKonzeptidee",
    "3. Umsetzungsfahrplan\n& Arbeitsstränge",
    "4. Nächste Schritte",
  ],
};

// ---- Tokens (pt) -----------------------------------------------------------
const COLOR = {
  blue: "0070C0",        // brand rule, numbers, icons, chevron
  blueLight: "BFE4FF",   // key-message box, active tab, outline note border
  ink: "000000",         // all body + title text
  kicker: "7F7F7F",      // title kicker ("Ausgangslage:"), hairlines
  footer: "767676",      // authors + slide number
  tabInactive: "A6A6A6", // inactive tab text
  surfaceTab: "F2F2F2",  // inactive tab fill, image-box fill
  chip: "D9D9D9",        // label chips, statement box
  frame: "BFBFBF",       // image-box border, dashed flow arrows
  note: "747474",        // italic side note text
  teal: "156082",        // diagram outline (ellipses)
  overlap: "E8E8E8",     // diagram overlap fill
  white: "FFFFFF",
};
const FONT = "Arial";
const P = (pt) => pt / 72; // points -> inches

const GEO = {
  tab: { x0: 13.5, step: 131.97, w: 125.6, h: 26, fs: 10 },
  title: { x: 54.8, y: 24, w: 860, h: 62, fs: 24, lineSpacing: 26 },
  rule: { y: 86.6, h: 5.1 },
  body: { x: 62, y: 130, w: 836, h: 290, fs: 14 },
  footer: { x: 62, y: 505, w: 400, h: 20, fs: 12 },
  pageNo: { x: 840, y: 505, w: 58, h: 20 },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = CONFIG.authors;
pres.title = CONFIG.deckTitle;
pres.theme = { headFontFace: FONT, bodyFontFace: FONT };

// ---- Layout pieces -----------------------------------------------------------
function tracker(active) {
  const t = GEO.tab;
  return CONFIG.chapters.map((label, i) => ({
    text: {
      text: label,
      options: {
        x: P(t.x0 + i * t.step), y: 0, w: P(t.w), h: P(t.h),
        shape: pres.ShapeType.rect,
        fill: { color: i === active ? COLOR.blueLight : COLOR.surfaceTab },
        line: { type: "none" },
        fontFace: FONT, fontSize: t.fs, bold: i === active,
        color: i === active ? COLOR.ink : COLOR.tabInactive,
        align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 0.9,
      },
    },
  }));
}
const rule = { rect: { x: 0, y: P(GEO.rule.y), w: P(960), h: P(GEO.rule.h), fill: { color: COLOR.blue }, line: { type: "none" } } };
const footer = {
  text: {
    text: CONFIG.authors,
    options: { x: P(GEO.footer.x), y: P(GEO.footer.y), w: P(GEO.footer.w), h: P(GEO.footer.h), fontFace: FONT, fontSize: GEO.footer.fs, color: COLOR.footer, margin: 0, valign: "middle" },
  },
};
const slideNumber = { x: P(GEO.pageNo.x), y: P(GEO.pageNo.y), w: P(GEO.pageNo.w), h: P(GEO.pageNo.h), fontFace: FONT, fontSize: 12, color: COLOR.footer, align: "right", valign: "middle", margin: 0 };

function titlePh(extra = {}) {
  const t = GEO.title;
  return {
    placeholder: {
      options: { name: "title", type: "title", x: P(t.x), y: P(t.y), w: P(t.w), h: P(t.h), fontFace: FONT, fontSize: t.fs, bold: true, color: COLOR.ink, valign: "bottom", margin: 0, ...extra },
      text: "Kicker: Kernaussage der Folie in maximal zwei Zeilen",
    },
  };
}
function bodyPh(opts = {}) {
  const b = GEO.body;
  return {
    placeholder: {
      options: { name: "body", type: "body", x: P(opts.x ?? b.x), y: P(opts.y ?? b.y), w: P(opts.w ?? b.w), h: P(opts.h ?? b.h), fontFace: FONT, fontSize: b.fs, color: COLOR.ink, valign: "top", margin: 0 },
      text: opts.text ?? "Stichpunkt: Text in 14 pt",
    },
  };
}

// Content layouts, one per active chapter (the agenda tracker is the slide frame).
CONFIG.chapters.forEach((_, i) => {
  pres.defineSlideMaster({
    title: `Inhalt - Kapitel ${i + 1}`,
    background: { color: COLOR.white },
    objects: [...tracker(i), rule, footer, titlePh(), bodyPh()],
    slideNumber,
  });
  pres.defineSlideMaster({
    title: `Nur Titel - Kapitel ${i + 1}`,
    background: { color: COLOR.white },
    objects: [...tracker(i), rule, footer, titlePh()],
    slideNumber,
  });
});
pres.defineSlideMaster({
  title: "Inhalt ohne Navigation",
  background: { color: COLOR.white },
  objects: [rule, footer, titlePh(), bodyPh()],
  slideNumber,
});
pres.defineSlideMaster({
  title: "Zwei Spalten - Kapitel 1",
  background: { color: COLOR.white },
  objects: [
    ...tracker(0), rule, footer, titlePh(),
    { placeholder: { options: { name: "left", type: "body", x: P(62), y: P(GEO.body.y), w: P(400), h: P(GEO.body.h), fontFace: FONT, fontSize: 14, color: COLOR.ink, valign: "top", margin: 0 }, text: "Linke Spalte" } },
    { placeholder: { options: { name: "right", type: "body", x: P(498), y: P(GEO.body.y), w: P(400), h: P(GEO.body.h), fontFace: FONT, fontSize: 14, color: COLOR.ink, valign: "top", margin: 0 }, text: "Rechte Spalte" } },
  ],
  slideNumber,
});
// Title slide: not in the source excerpt — an intentional, minimal addition built from the same parts.
pres.defineSlideMaster({
  title: "Titelfolie",
  background: { color: COLOR.white },
  objects: [
    { rect: { x: 0, y: P(300), w: P(960), h: P(GEO.rule.h), fill: { color: COLOR.blue }, line: { type: "none" } } },
    { placeholder: { options: { name: "title", type: "title", x: P(54.8), y: P(170), w: P(850), h: P(120), fontFace: FONT, fontSize: 32, bold: true, color: COLOR.ink, valign: "bottom", margin: 0 }, text: "Titel der Präsentation" } },
    { placeholder: { options: { name: "subtitle", type: "body", x: P(54.8), y: P(320), w: P(850), h: P(60), fontFace: FONT, fontSize: 16, color: COLOR.kicker, valign: "top", margin: 0 }, text: "Untertitel · Datum" } },
    footer,
  ],
});
pres.defineSlideMaster({ title: "Leer", background: { color: COLOR.white }, objects: [footer], slideNumber });

// ---- Components (composed on slides) ---------------------------------------
const MEDIA = (f) => path.join(__dirname, "media", f);
let objId = 0;
const nm = (n) => `${n}-${++objId}`;

// Title with grey kicker run, filled into the layout placeholder.
function title(slide, kicker, rest) {
  slide.addText(
    [
      { text: kicker + " ", options: { color: COLOR.kicker } },
      { text: rest, options: { color: COLOR.ink } },
    ],
    { placeholder: "title" }
  );
}

// Key message: light-blue box + blue right-pointing triangle with white 1.5 pt outline overlapping its left edge.
function keyMessage(slide, { x, y, w, h = 44 }, runs) {
  slide.addText(runs, {
    x: P(x), y: P(y), w: P(w), h: P(h), shape: pres.ShapeType.rect, fill: { color: COLOR.blueLight }, line: { type: "none" },
    fontFace: FONT, fontSize: 14, color: COLOR.ink, align: "center", valign: "middle", margin: 8, objectName: nm("Kernaussage"),
  });
  const tw = 16.25, th = 41.8, cx = x - 8.1 + tw / 2, cy = y + 1.1 + th / 2;
  slide.addShape(pres.ShapeType.triangle, {
    x: P(cx - th / 2), y: P(cy - tw / 2), w: P(th), h: P(tw), rotate: 90,
    fill: { color: COLOR.blue }, line: { color: COLOR.white, width: 1.5 }, objectName: nm("Kernaussage-Pfeil"),
  });
}

// Bold label + regular text in one paragraph.
const lead = (label, text, extra = {}) => [
  { text: label + " ", options: { bold: true } },
  { text, options: { ...extra } },
];

// Icon list row: blue line icon (23 pt) + bold lead + text.
function iconRow(slide, icon, { x, y, w, h }, runs, iconSize = 23) {
  slide.addImage({ path: MEDIA(icon), x: P(x - 29), y: P(y + 1), w: P(iconSize), h: P(iconSize), objectName: nm("Icon") });
  slide.addText(runs, { x: P(x), y: P(y), w: P(w), h: P(h), fontFace: FONT, fontSize: 14, color: COLOR.ink, valign: "top", margin: 0, isTextBox: true, objectName: nm("Icon-Text") });
}

// Section header: bold 14 pt label over a 1 pt #7F7F7F hairline.
function sectionHeader(slide, text, { x, y, w }) {
  slide.addText(text, { x: P(x + 7), y: P(y), w: P(w - 7), h: P(18), fontFace: FONT, fontSize: 14, bold: true, color: COLOR.ink, margin: 0, isTextBox: true, objectName: nm("Abschnitt") });
  slide.addShape(pres.ShapeType.line, { x: P(x), y: P(y + 24), w: P(w), h: 0, line: { color: COLOR.kicker, width: 1 }, objectName: nm("Abschnitt-Linie") });
}

function bullets(slide, items, { x, y, w, h, gap = 18 }) {
  slide.addText(
    items.map((t, i) => ({ text: t, options: { bullet: { code: "25AA", indent: 22.5 }, paraSpaceAfter: gap, breakLine: i < items.length - 1 } })),
    { x: P(x), y: P(y), w: P(w), h: P(h), fontFace: FONT, fontSize: 14, color: COLOR.ink, valign: "top", margin: 0, isTextBox: true, objectName: nm("Aufzaehlung") }
  );
}

// ---- Sample slides (the source deck rebuilt on the master) -------------------
function buildSamples(p) {
  // Slide 4 of the source: icon list + feature photo + key message
  let s = p.addSlide({ masterName: "Nur Titel - Kapitel 1" });
  title(s, "Ausgangslage:", "Stadien sind weit mehr als nur Infrastruktur für den Spielbetrieb des Profifußballs");
  s.addText("Moderne Stadien verbinden…", { x: P(62), y: P(173), w: P(600), h: P(20), fontFace: FONT, fontSize: 14, bold: true, color: COLOR.ink, margin: 0, isTextBox: true });
  [
    ["icon0.png", "Menschen und Gesellschaft:", "gemeinsame Erlebnisse in einer zunehmend fragmentierten Welt"],
    ["icon1.png", "Sport und Emotion:", "identitätsstiftende Plattformen mit außergewöhnlicher Bindung"],
    ["icon2.png", "Medien und Reichweite:", "Ausgangspunkt eines national & international vermarktbaren Produkts"],
    ["icon3.png", "Marken und Unternehmen:", "emotionale Aufladung von Partnerschaften und Standorten"],
    ["icon4.png", "Überregionale Wertschöpfung:", "Impulse für Unternehmen, Tourismus und Dienstleistungen"],
  ].forEach(([ic, a, b], i) => iconRow(s, ic, { x: 84.5, y: 213.5 + i * 40.8, w: 600, h: 20 }, lead(a, b)));
  s.addImage({ path: MEDIA("photo_feature.png"), x: P(689.25 - 7.93), y: P(139.47 - 7.93), w: P(215.94 + 15.86), h: P(296.15 + 15.86), objectName: "Foto" });
  keyMessage(s, { x: 199.1, y: 443.6, w: 561.8 }, "Stadien führen an ihren Standorten Sport, Emotionen, Medien und wirtschaftliche Wertschöpfung zusammen – und sind damit zentrale gesellschaftliche Plattformen");

  // Slide 5: stat rows over a backdrop photo + outline note
  s = p.addSlide({ masterName: "Nur Titel - Kapitel 1" });
  title(s, "Ausgangslage:", "Deutschland kann Stadioninfrastruktur als internationales Schaufenster nutzen");
  s.addText(
    [
      { text: "Deutschland hat bei der " }, { text: "WM 2006 ", options: { bold: true } },
      { text: "gezeigt, wie Infrastrukturinvestitionen und die Ausrichtung eines internationalen Turniers zur " },
      { text: "Entfaltung internationaler Strahlkraft", options: { bold: true } }, { text: " beitragen können…" },
    ],
    { x: P(123), y: P(132), w: P(265), h: P(90), fontFace: FONT, fontSize: 14, color: COLOR.ink, margin: 0, valign: "top", isTextBox: true }
  );
  s.addImage({ path: MEDIA("photo_backdrop.png"), x: P(541), y: P(137.1), w: P(364.3), h: P(282.7), objectName: "Hintergrundfoto" });
  const stats = [
    ["~3,4 Mrd. €", [{ text: "Investitionen in Stadien und Infrastruktur", options: { bold: true } }]],
    ["35.000", [{ text: "geschaffene Jobs ", options: { bold: true } }, { text: "(Jahres-FTE)" }]],
    ["~3,2 Mrd. €", [{ text: "Netto-Effekt auf Bruttoinlandsprodukt im Jahr 2006", options: { bold: true } }]],
  ];
  stats.forEach(([n, lbl], i) => {
    const y = 133 + i * 53.6;
    s.addText(n, { x: P(403), y: P(y), w: P(133), h: P(54), fontFace: FONT, fontSize: 24, bold: true, color: COLOR.blue, align: "right", valign: "middle", margin: 0, isTextBox: true, objectName: nm("Kennzahl") });
    s.addText(lbl, { x: P(554.8), y: P(y), w: P(345), h: P(54), fontFace: FONT, fontSize: 14, color: COLOR.ink, valign: "middle", margin: 0, isTextBox: true });
    s.addShape(pres.ShapeType.line, { x: P(403), y: P(y + 54), w: P(502), h: 0, line: { color: COLOR.kicker, width: 1 } });
  });
  s.addText(
    [{ text: "Internationale Zustimmungswerte stark gestiegen", options: { bold: true, breakLine: true } }, { text: "(z.B. in allen Dimensionen „Anholt Nation Brand Index“)", options: { italic: true } }],
    { x: P(554.8), y: P(297), w: P(350), h: P(52), fontFace: FONT, fontSize: 14, color: COLOR.ink, valign: "middle", margin: 0, isTextBox: true }
  );
  s.addShape(pres.ShapeType.line, { x: P(541), y: P(350.5), w: P(364), h: 0, line: { color: COLOR.kicker, width: 1 } });
  s.addText("Nationales Gemeinschaftsgefühl und Patriotismus in der Gesellschaft spürbar verbessert", { x: P(554.8), y: P(354), w: P(345), h: P(52), fontFace: FONT, fontSize: 14, bold: true, color: COLOR.ink, valign: "middle", margin: 0, isTextBox: true });
  s.addText("+ insbesondere weiche und symbolische Faktoren", { x: P(406), y: P(311.5), w: P(108), h: P(78), shape: pres.ShapeType.rect, fill: { color: COLOR.white }, line: { color: COLOR.blueLight, width: 1.5 }, fontFace: FONT, fontSize: 14, italic: true, color: COLOR.note, align: "center", valign: "middle", margin: 2, objectName: "Randnotiz" });
  keyMessage(s, { x: 106, y: 442, w: 748 }, "Eine neue Generation deutscher Stadien kann zeigen, wofür deutsche Ingenieurskunst weiterhin steht: technologisch führende, wirtschaftlich tragfähige und ökologisch nachhaltige Infrastruktur mit langfristigen Nutzungskonzepten.");

  // Slide 6: bullet list in the body placeholder + key message
  s = p.addSlide({ masterName: "Inhalt - Kapitel 1" });
  title(s, "Ausgangslage:", "Deutschland steht vor einem neuen Investitionszyklus in Stadion- und Digitalinfrastruktur");
  s.addText(
    [
      ["Investitionszyklus:", "Viele deutsche Stadien wurden rund um die Männer-WM 2006 neu gebaut oder umfassend modernisiert – in den kommenden Jahren entsteht erneut struktureller Erneuerungsbedarf."],
      ["Neue Anforderungen:", "Medienprodukt, Konnektivität, Daten, Sicherheit, Nachhaltigkeit, Hospitality und Fan-Erlebnis entwickeln sich schneller als klassische Stadionzyklen."],
      ["Optimierungsbedarf:", "Technische Infrastruktur sowie mediale, digitale und kommerzielle Verwertbarkeit vieler Standorte entsprechen nicht mehr den neuesten Möglichkeiten."],
      ["Wettbewerbsdruck:", "Andere europäische Ligen und Clubs investieren – teils unterstützt durch hohe externe Kapitalzuflüsse – erheblich in Infrastruktur und Technologie."],
      ["WM als Katalysator:", "Mögliche Männer-WM 2038 oder 2042 kann bestehende Bedarfe beschleunigen."],
      ["Zeitfenster:", "Frühzeitige Planung, Standardisierung und Finanzierung vermeiden spätere Einzellösungen unter Zeit- und Kostendruck – relevanter Investitions- und Bauzeitraum dürfte 2033-2037 liegen, entsprechend besteht bereits heute Zeitdruck"],
    ].flatMap(([a, b], i, arr) => [
      { text: a + " ", options: { bold: true } },
      { text: b, options: { breakLine: i < arr.length - 1 } },
    ]),
    { placeholder: "body" }
  );
  keyMessage(s, { x: 158.5, y: 438, w: 603 }, [
    { text: "Deutschland benötigt in den kommenden 10 bis 15 Jahren eine " },
    { text: "neue Generation physischer und digitaler Stadioninfrastruktur", options: { bold: true } },
  ]);

  // Slide 7: section headers, Venn pair, icon list with multi-line paragraphs
  s = p.addSlide({ masterName: "Nur Titel - Kapitel 1" });
  title(s, "Zielbild:", "Deutschland hat eine europaweit führende Stadiongeneration für die kommenden Jahrzehnte");
  sectionHeader(s, "Übergreifendes Zielbild", { x: 55, y: 146, w: 314 });
  sectionHeader(s, "Dimensionen des übergreifenden Zielbilds", { x: 451.9, y: 146, w: 453 });
  s.addShape(pres.ShapeType.ellipse, { x: P(63), y: P(310), w: P(290), h: P(180), fill: { color: COLOR.white, transparency: 100 }, line: { color: COLOR.teal, width: 0.75 }, objectName: "Venn-unten" });
  s.addShape(pres.ShapeType.ellipse, { x: P(63), y: P(173), w: P(290), h: P(180), fill: { color: COLOR.white, transparency: 100 }, line: { color: COLOR.teal, width: 0.75 }, objectName: "Venn-oben" });
  s.addText([{ text: "Benchmark im\neuropäischen Fußball:", options: { bold: true, breakLine: true } }, { text: "Bundesliga und 2. Bundesliga nehmen unter den Top-5-Ligen in Europa eine Führungsrolle bei Stadion- und Digitalinfrastruktur ein" }], { x: P(85), y: P(193), w: P(246), h: P(110), fontFace: FONT, fontSize: 14, color: COLOR.ink, align: "center", valign: "top", margin: 0, isTextBox: true });
  s.addText([{ text: "Wettbewerbsfähigkeit bei\nGroß-Events:", options: { bold: true, breakLine: true } }, { text: "Deutschland ist wettbewerbsfähig für die Austragung internationaler Sport- und Entertainment-Großereignisse" }], { x: P(85), y: P(370), w: P(246), h: P(90), fontFace: FONT, fontSize: 14, color: COLOR.ink, align: "center", valign: "top", margin: 0, isTextBox: true });
  [
    ["icon5.png", 197.5, "Kommerzielle Stärke:", "Abstände zu anderen Ländern z.B. mit Blick auf externen Kapitalzufluss werden kompensiert durch optimierte kommerzielle Verwertbarkeit von physischer und digitaler Infrastruktur."],
    ["icon6.png", 283, "Technologische Exzellenz:", "Stadien ermöglichen ein führendes Medienprodukt, datenbasierte Innovationen und ein vernetztes Fan-Erlebnis."],
    ["icon7.png", 351.5, "Nachhaltige Infrastruktur:", "Energieeffiziente und resilientere Spielstätten erfüllen steigende regulatorische Anforderungen und ermöglichen hohe Betriebskosteneffizienz."],
    ["icon8.png", 420, "Gesellschaftliche und regionale Wirkung:", "Stadien stärken Begegnung, Standorte und lokale Wertschöpfungsnetzwerke."],
  ].forEach(([ic, y, a, b]) => iconRow(s, ic, { x: 488.4, y, w: 415, h: 70 }, lead(a, b), 24));

  // Slide 8: label chips + hairline rows
  s = p.addSlide({ masterName: "Nur Titel - Kapitel 1" });
  title(s, "Zielbild:", "Die nächste Stadiongeneration stärkt die wirtschaftliche Wertschöpfung über Jahrzehnte durch Erfüllung höchster Standards");
  [
    ["Medienprodukt", "Kamerapositionen, Produktionsflächen, Audio, Remote Produktion prägen Qualität und Innovationsfähigkeit des Medienprodukts – auf Club- und Ligaebene."],
    ["Daten & Konnektivität", "Wi-Fi, 5G, IoT-Sensorik und integrierte Datenplattformen sind das Rückgrat neuer digitaler Produkte."],
    ["Hospitality", "Business Seats, Logen und weitere Premiumangebote sind wesentliche kommerzielle Treiber im Stadionbetrieb und werden zunehmend differenzierter."],
    ["Fan-Erlebnis", "Komplementäre Angebote im Stadionumfeld (z.B. Retail) und Rahmenprogramm ergänzen in hybrider Form (physisch und digital) das Live-Event – digitale Flächen sind dabei wichtige Enabler"],
    ["Nachhaltigkeit, Energie & Operations", "Energieeffizienz, Kreislaufwirtschaft, Automatisierung und Predictive Maintenance senken Betriebskosten und erhöhen Zukunftsfähigkeit."],
    ["365-Tage-Nutzung", "Ganzjährige Auslastung durch Sportveranstaltungen, Konzerte, und weitere Nutzungsformen ist elementar für Rentabilität von Stadien – Modularität und schnelle Wechselzeiten notwendig."],
  ].forEach(([chip, txt], i) => {
    const y = 146 + i * 59.6;
    s.addText(chip, { x: P(55), y: P(y), w: P(171), h: P(39), shape: pres.ShapeType.roundRect, rectRadius: P(6), fill: { color: COLOR.chip }, line: { type: "none" }, fontFace: FONT, fontSize: 14, bold: true, color: COLOR.ink, align: "center", valign: "middle", margin: 0, objectName: nm("Label-Chip") });
    s.addText(txt, { x: P(254.2), y: P(y - 8), w: P(430), h: P(55), fontFace: FONT, fontSize: 14, color: COLOR.ink, valign: "middle", margin: 0, isTextBox: true });
    if (i < 5) s.addShape(pres.ShapeType.line, { x: P(55), y: P(y + 49), w: P(850), h: 0, line: { color: COLOR.kicker, width: 1 } });
  });

  // Slide 9: statement box + today/tomorrow flow through an image box
  s = p.addSlide({ masterName: "Nur Titel - Kapitel 1" });
  title(s, "Zielbild:", "Digital- und Stadioninfrastruktur bestimmt das Medienprodukt von morgen – die zentrale Erlössäule im Profifußball");
  s.addText("Stadioninfrastruktur bestimmt, welches Medienprodukt hergestellt und vermarktet werden kann – und ist damit Werttreiber des gesamten Mediengeschäfts im Profifußball", { x: P(160.5), y: P(139.3), w: P(639), h: P(46), shape: pres.ShapeType.roundRect, rectRadius: P(6), fill: { color: COLOR.chip }, line: { type: "none" }, fontFace: FONT, fontSize: 14, color: COLOR.ink, align: "center", valign: "middle", margin: 14, objectName: "Statement" });
  s.addText("Heute…", { x: P(62), y: P(211), w: P(250), h: P(20), fontFace: FONT, fontSize: 14, bold: true, margin: 0, isTextBox: true });
  s.addText("Zukünftig…", { x: P(588.1), y: P(211), w: P(250), h: P(20), fontFace: FONT, fontSize: 14, bold: true, margin: 0, isTextBox: true });
  [259, 293.4, 327.7, 362, 396.4].forEach((y) => s.addShape(pres.ShapeType.line, { x: P(320), y: P(y), w: P(237), h: 0, line: { color: COLOR.frame, width: 1.5, dashType: "dash", endArrowType: "triangle" }, objectName: nm("Fluss-Pfeil") }));
  s.addShape(pres.ShapeType.rect, { x: P(342), y: P(230.2), w: P(193), h: P(192.1), fill: { color: COLOR.surfaceTab }, line: { color: COLOR.frame, width: 1.5 }, objectName: "Bildrahmen" });
  s.addImage({ path: MEDIA("photo_backdrop_box.png"), x: P(342.75), y: P(230.95), w: P(191.5), h: P(190.6) });
  s.addText("Stadioninfrastruktur ist zentrale Voraussetzung", { x: P(350), y: P(305), w: P(177), h: P(42), fontFace: FONT, fontSize: 14, bold: true, color: COLOR.ink, align: "center", valign: "middle", margin: 0, isTextBox: true });
  bullets(s, ["Lineares Broadcasting", "„Klassische“ Vor-Ort-Produktion", "Wenige standardisierte Signale", "Broadcast-zentriert", "Primär nationales Produkt"], { x: 62, y: 246, w: 250, h: 170 });
  bullets(s, ["Multi-Plattform und D2C", "Automatisierte und Remote Produktion", "Individualisierte Feeds", "Daten, Tracking, AR und immersive Formate", "Globales digitales Produkt"], { x: 588.1, y: 246, w: 320, h: 170 });
  keyMessage(s, { x: 171, y: 438, w: 618 }, "Medienkonsum, -technologie und -märkte verändern sich fundamental – physische und auch digitale Produktionsinfrastruktur in Stadien muss sich daher signifikant verbessern");
}

// ---- Output -------------------------------------------------------------------
async function main() {
  // Master file: one example slide per layout, so the layouts show in thumbnails and PowerPoint keeps them.
  const s1 = pres.addSlide({ masterName: "Titelfolie" });
  s1.addText(CONFIG.deckTitle, { placeholder: "title" });
  s1.addText("Vorlage · Folienmaster", { placeholder: "subtitle" });
  const s2 = pres.addSlide({ masterName: "Inhalt - Kapitel 1" });
  title(s2, "Kicker:", "Kernaussage der Folie als vollständiger Satz in maximal zwei Zeilen");
  s2.addText(
    [
      ...lead("Stichpunkt mit Lead-in:", "Fließtext in Arial 14 pt, schwarz; das Lead-in ist fett und endet mit Doppelpunkt.", { breakLine: true }),
      ...lead("Zweiter Stichpunkt:", "18 pt Abstand nach jedem Absatz, quadratisches Aufzählungszeichen (Wingdings §)."),
    ],
    { placeholder: "body" }
  );
  keyMessage(s2, { x: 199.1, y: 443.6, w: 561.8 }, "Kernaussage (So-what) in 14 pt, zentriert, in hellblauer Box mit blauem Pfeil");
  const s3 = pres.addSlide({ masterName: "Nur Titel - Kapitel 2" });
  title(s3, "Kicker:", "Folie nur mit Titel – freie Komposition aus den Bausteinen");
  const s4 = pres.addSlide({ masterName: "Zwei Spalten - Kapitel 1" });
  title(s4, "Kicker:", "Zwei Spalten für Gegenüberstellungen");
  s4.addText("Linke Spalte", { placeholder: "left" });
  s4.addText("Rechte Spalte", { placeholder: "right" });
  await pres.writeFile({ fileName: path.join(__dirname, "Arenas_Master.pptx") });

  // Samples deck uses the same layouts.
  const ex = new pptxgen();
  ex.layout = "LAYOUT_WIDE";
  ex.author = CONFIG.authors;
  ex.title = CONFIG.deckTitle + " – Beispiele";
  ex.theme = { headFontFace: FONT, bodyFontFace: FONT };
  // re-register the same layouts on the second instance
  const orig = pres;
  for (const name of ["Nur Titel - Kapitel 1", "Inhalt - Kapitel 1"]) {
    const active = 0;
    ex.defineSlideMaster({
      title: name,
      background: { color: COLOR.white },
      objects: name.startsWith("Inhalt") ? [...trackerFor(ex, active), rule, footer, titlePh(), bodyPh()] : [...trackerFor(ex, active), rule, footer, titlePh()],
      slideNumber,
    });
  }
  objId = 0;
  buildSamplesWith(ex);
  await ex.writeFile({ fileName: path.join(__dirname, "Arenas_Beispiele.pptx") });
  void orig;
}

// tracker() and the components reference `pres` for ShapeType only; ShapeType is static across instances.
function trackerFor(_inst, active) { return tracker(active); }
function buildSamplesWith(inst) { buildSamples(inst); }

main().catch((e) => { console.error(e); process.exit(1); });
