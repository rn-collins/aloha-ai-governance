export default function handler(req, res) {
  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>AI Governance Tracker — Aloha AI Consulting</title><meta name="description" content="A weekly automated web sweep for FTC AI enforcement, Congressional AI legislation, bar and ABA ethics guidance, and EU AI Act developments. Findings are unreviewed search results, not verified primary sources. Built by RN Collins, Aloha AI Consulting."><meta name="robots" content="index, follow"><link rel="canonical" href="https://aloha-ai-governance.vercel.app"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><meta property="og:image" content="https://aloha-ai-governance.vercel.app/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="AI Governance Tracker — Aloha AI Consulting"><meta name="twitter:image" content="https://aloha-ai-governance.vercel.app/og-image.png"><meta property="og:title" content="AI Governance Tracker — Aloha AI Consulting"><meta property="og:description" content="A weekly automated web sweep for FTC AI enforcement, Congressional AI legislation, bar and ABA ethics guidance, and EU AI Act developments. Findings are unreviewed search results."><meta property="og:type" content="website"><meta property="og:url" content="https://aloha-ai-governance.vercel.app"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="AI Governance Tracker — Aloha AI Consulting"><meta name="twitter:description" content="A weekly automated web sweep for FTC AI enforcement, Congressional AI legislation, bar and ABA ethics guidance, and EU AI Act developments. Findings are unreviewed search results."><style>@font-face{font-family:'Faustina';font-style:italic;font-weight:400;font-display:swap;src:url('/fonts/faustina-italic-400-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Faustina';font-style:italic;font-weight:400;font-display:swap;src:url('/fonts/faustina-italic-400-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Faustina';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/faustina-normal-400-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Faustina';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/faustina-normal-400-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Faustina';font-style:normal;font-weight:500;font-display:swap;src:url('/fonts/faustina-normal-500-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Faustina';font-style:normal;font-weight:500;font-display:swap;src:url('/fonts/faustina-normal-500-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Faustina';font-style:normal;font-weight:600;font-display:swap;src:url('/fonts/faustina-normal-600-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Faustina';font-style:normal;font-weight:600;font-display:swap;src:url('/fonts/faustina-normal-600-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Faustina';font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/faustina-normal-700-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Faustina';font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/faustina-normal-700-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Epilogue';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/epilogue-normal-400-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Epilogue';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/epilogue-normal-400-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Epilogue';font-style:normal;font-weight:500;font-display:swap;src:url('/fonts/epilogue-normal-500-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Epilogue';font-style:normal;font-weight:500;font-display:swap;src:url('/fonts/epilogue-normal-500-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Epilogue';font-style:normal;font-weight:600;font-display:swap;src:url('/fonts/epilogue-normal-600-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Epilogue';font-style:normal;font-weight:600;font-display:swap;src:url('/fonts/epilogue-normal-600-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
@font-face{font-family:'Epilogue';font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/epilogue-normal-700-latin-ext.woff2') format('woff2');unicode-range:U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;}
@font-face{font-family:'Epilogue';font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/epilogue-normal-700-latin.woff2') format('woff2');unicode-range:U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;}
/* AI Governance Tracker — a sweep log, not a product dashboard.

   What shipped before was the estate's default signature: Cormorant Garamond /
   Syne / Manrope / DM Mono on F6F3EC cream with rounded white cards and pill
   filters — the same four faces declared by aloha-legal-ai-monitor and by
   set-for-life, which is not even an Aloha property.

   This page's own copy says what it is: five saved searches run once a week,
   published without review. Its load-bearing facts are WHEN it last collected
   and WHETHER that is current. That is a duty log — a dated record of a
   machine's rounds — so it is now ruled and stamped rather than carded.

   Faustina carries the masthead, headings and figures; Epilogue carries text
   and, tracked and tabular, the keys (dates, hosts, counts) that DM Mono used
   to carry. Both are self-hosted: font-src here is 'self' plus gstatic, and
   self-hosting needs no CSP change at all.

   COLOUR SPLIT: teal previously meant both "Aloha" and "collection is current".
   An accent cannot also be a semantic, or green cannot mean green. The site
   accent is now aubergine; green is reserved for a healthy collection, brick
   for overdue or failed, ochre for degraded. Those three are unchanged in
   meaning. */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --paper: #ECEEF0;        /* cool oyster — off the estate cream */
  --field: #F7F8F9;        /* the ruled field entries sit on */
  --ink: #16181C;
  --ink-soft: #454A52;
  --ink-key: #3C424B;      /* keys: dark enough to hold at 9-10px */
  --rule: #C4C9CF;
  --rule-soft: #DCE0E4;
  --accent: #4B2E63;       /* aubergine: decoration and interaction only */
  --accent-deep: #3A2350;
  --accent-soft: #EEEAF2;
  /* Semantics. These carry meaning and are deliberately not decorative. */
  --ok: #1B6144;           /* collection current */
  --ok-soft: #E2EFE9;
  --warn: #6B4B10;         /* degraded */
  --warn-soft: #F5EEDC;
  --bad: #93301A;          /* overdue / failed */
  --bad-soft: #F6E7E2;
}

body {
  font-family: 'Epilogue', system-ui, sans-serif;
  background: var(--paper);
  color: var(--ink);
  min-height: 100vh;
  line-height: 1.6;
  -webkit-text-size-adjust: 100%;
  font-synthesis-weight: none;
}

.page { max-width: 940px; margin: 0 auto; padding: 44px max(18px, 4vw) 60px; }

/* Keys — ids, hosts, dates, counts. Epilogue tracked and tabular does the job
   DM Mono did, without adding a third face the estate already spends. */
.doc-sub, .stat-label, .stat-sub, .doc-meta, .health-state, .cat-pill,
.status-pill, .footer-creds, .footer-contact, .footer-disclaimer {
  font-variant-numeric: tabular-nums lining-nums;
  font-feature-settings: 'tnum' 1, 'lnum' 1;
}
.stat-label, .health-state, .status-pill, .section-label, .brand {
  letter-spacing: .09em;
  text-transform: uppercase;
}

/* --- masthead: a dated log opens with a rule, not a hero ---------------- */
.header {
  display: flex; justify-content: space-between; align-items: flex-start;
  gap: 20px; flex-wrap: wrap;
  margin-bottom: 30px; padding-bottom: 18px;
  border-bottom: 2px solid var(--ink);
}
.brand {
  font-family: 'Epilogue', sans-serif; font-size: 10px; font-weight: 700;
  color: var(--accent); margin-bottom: 12px;
  display: flex; align-items: center; gap: 7px;
}
.brand-dot { width: 7px; height: 7px; border-radius: 0; background: var(--accent); }
.doc-title {
  font-family: 'Faustina', Georgia, serif;
  font-size: clamp(30px, 6vw, 42px); font-weight: 600; line-height: 1.08;
  letter-spacing: -.012em;
}
.doc-sub {
  font-size: 13px; color: var(--ink-soft); margin-top: 9px; max-width: 56ch;
  line-height: 1.6;
}
.status-pill {
  display: flex; align-items: center; gap: 7px;
  background: transparent; border: 0; border-top: 2px solid var(--ink);
  border-radius: 0; padding: 7px 0 0; font-size: 10px; font-weight: 600;
  color: var(--ink-key); white-space: nowrap;
}
.pulse { width: 7px; height: 7px; border-radius: 50%; background: var(--ok); }
@media (prefers-reduced-motion: no-preference) {
  .pulse { animation: pulse 2s ease-in-out infinite; }
}
@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: .35 } }

/* --- collection state: a stamp in the margin, not a card ---------------- */
.health-banner {
  display: flex; justify-content: space-between; gap: 18px;
  align-items: center; flex-wrap: wrap;
  background: var(--field);
  border: 0; border-left: 4px solid var(--rule);
  border-radius: 0; padding: 13px 16px; margin-bottom: 22px;
}
.health-banner.current  { border-left-color: var(--ok);   background: var(--ok-soft); }
.health-banner.stale,
.health-banner.failed   { border-left-color: var(--bad);  background: var(--bad-soft); }
.health-banner.degraded { border-left-color: var(--warn); background: var(--warn-soft); }
.health-title { font-family: 'Faustina', Georgia, serif; font-size: 17px; font-weight: 600; line-height: 1.25; }
.health-detail { font-size: 12px; color: var(--ink-soft); margin-top: 5px; line-height: 1.6; max-width: 74ch; }
.health-state { font-size: 10px; font-weight: 700; white-space: nowrap; color: var(--ink-key); }

/* --- the four figures: ruled columns, not four rounded boxes ------------ */
.stats-row {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
  margin-bottom: 30px;
  border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule);
}
.stat-card {
  background: transparent; border: 0; border-radius: 0;
  border-left: 1px solid var(--rule-soft);
  padding: 14px 16px;
}
.stat-card:first-child { border-left: 0; padding-left: 0; }
.stat-label { font-size: 9px; font-weight: 700; color: var(--ink-key); margin-bottom: 7px; }
.stat-value {
  font-family: 'Faustina', Georgia, serif; font-size: 32px; font-weight: 600;
  color: var(--ink); line-height: 1;
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: 'lnum' 1, 'tnum' 1;
}
.stat-sub { font-size: 10.5px; color: var(--ink-soft); margin-top: 5px; }

/* --- filters: tabs along a rule, not floating pills --------------------- */
.cat-row {
  display: flex; flex-wrap: wrap; gap: 0 4px;
  margin-bottom: 22px; border-bottom: 1px solid var(--rule);
}
.cat-pill {
  font-family: inherit; font-size: 11px; font-weight: 600;
  padding: 7px 11px; border: 0; border-radius: 0;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
  background: transparent; cursor: pointer; transition: color .12s, border-color .12s;
}
.cat-pill.active   { color: var(--accent-deep); border-bottom-color: var(--accent); background: transparent; }
.cat-pill.inactive { color: var(--ink-soft); }
.cat-pill.inactive:hover { color: var(--ink); border-bottom-color: var(--rule); }

.section-label {
  font-family: 'Epilogue', sans-serif; font-size: 10px; font-weight: 700;
  color: var(--ink-key); margin-bottom: 0;
  padding-bottom: 8px; border-bottom: 2px solid var(--ink);
}

/* --- the findings: ruled entries in a log ------------------------------- */
.doc-list { display: flex; flex-direction: column; gap: 0; margin-bottom: 40px; }
.doc-card {
  background: transparent; border: 0; border-bottom: 1px solid var(--rule-soft);
  border-radius: 0; padding: 15px 4px 15px 0;
  display: grid; grid-template-columns: 74px 1fr; gap: 16px; align-items: start;
  text-decoration: none; color: inherit;
  transition: background .12s;
}
.doc-card:hover { background: var(--field); box-shadow: none; border-color: var(--rule); }
.badge {
  font-size: 9px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase;
  padding: 3px 0; border-radius: 0; white-space: normal; margin-top: 3px;
  border-top: 2px solid currentColor; display: block; line-height: 1.35;
}
.badge-congress { background: transparent; color: #14513F; }
.badge-ftc      { background: transparent; color: #6B4B10; }
.doc-title-text { font-family: 'Faustina', Georgia, serif; font-size: 17px; font-weight: 600; color: var(--ink); line-height: 1.3; margin-bottom: 5px; }
.doc-meta { font-size: 10.5px; font-weight: 500; color: var(--ink-key); letter-spacing: .02em; }
.doc-abstract { font-size: 12.5px; color: var(--ink-soft); line-height: 1.6; margin-top: 7px; max-width: 78ch; }
.no-results { padding: 40px 0; color: var(--ink-soft); font-size: 13px; }

/* --- the note at the foot of the log ----------------------------------- */
.prose { border-top: 2px solid var(--ink); padding-top: 24px; margin-top: 34px; max-width: 68ch; }
.prose h2 {
  font-family: 'Epilogue', sans-serif; font-size: 10px; font-weight: 700;
  letter-spacing: .1em; text-transform: uppercase;
  color: var(--ink-key);           /* was #7a7875 on cream: 3.97:1, a failure */
  margin: 26px 0 10px;
}
.prose h2:first-child { margin-top: 0; }
.prose p { font-size: 14px; line-height: 1.68; color: var(--ink-soft); margin-bottom: 12px; }
.prose a { color: var(--accent-deep); text-underline-offset: 2px; }
.prose ul { margin: 0 0 12px 18px; padding: 0; }
.prose li { font-size: 14px; line-height: 1.6; color: var(--ink-soft); margin-bottom: 7px; }

.footer {
  border-top: 1px solid var(--rule); padding-top: 22px; margin-top: 8px;
  display: flex; justify-content: space-between; align-items: flex-end;
  gap: 22px; flex-wrap: wrap;
}
.footer-name { font-family: 'Faustina', Georgia, serif; font-size: 17px; font-weight: 600; }
.footer-creds { font-size: 10.5px; color: var(--ink-soft); margin-top: 4px; line-height: 1.7; }
.footer-contact { text-align: right; font-size: 10.5px; line-height: 1.9; }
.footer-contact a { color: var(--accent-deep); text-decoration: none; }
.footer-contact a:hover { text-decoration: underline; }
.footer-disclaimer { margin-top: 14px; font-size: 10.5px; color: var(--ink-soft); line-height: 1.65; max-width: 88ch; }

/* --- affordances -------------------------------------------------------- */
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
.skip-link { position: absolute; left: -9999px; }
.skip-link:focus {
  position: static; display: inline-block; padding: 7px 11px;
  background: var(--accent); color: #fff; font-size: 12px; font-weight: 600;
}
a:focus-visible, button:focus-visible, .cat-pill:focus-visible, .doc-card:focus-visible {
  outline: 3px solid var(--accent); outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
@media (forced-colors: active) {
  .health-banner, .stat-card, .doc-card, .cat-row, .stats-row { border-color: CanvasText; }
  .badge { border-top-color: CanvasText; color: CanvasText; }
  .cat-pill.active { border-bottom-color: Highlight; }
  .pulse, .brand-dot { forced-color-adjust: none; background: CanvasText; }
  a:focus-visible, button:focus-visible { outline-color: Highlight; }
}
@media print {
  body { background: #fff; color: #000; }
  .page { max-width: none; padding: 0; }
  .cat-row, .status-pill, .skip-link { display: none; }
  .doc-card { break-inside: avoid; border-bottom: 1px solid #999; }
  .doc-card[href]::after { content: ' (' attr(href) ')'; font-size: 9px; color: #444; word-break: break-all; }
  .prose, .section-label, .header, .footer { border-color: #000; }
}
@media (max-width: 640px) {
  .page { padding: 26px 16px 44px; }
  .stats-row { grid-template-columns: 1fr 1fr; border-bottom: 0; }
  .stat-card { border-bottom: 1px solid var(--rule-soft); }
  .stat-card:nth-child(odd) { border-left: 0; padding-left: 0; }
  .doc-card { grid-template-columns: 1fr; gap: 7px; }
  .badge { display: inline-block; }
  .header { flex-direction: column; gap: 14px; }
  .footer { flex-direction: column; align-items: flex-start; gap: 16px; }
  .footer-contact { text-align: left; }
}</style></head><body><a href="#main-content" class="skip-link">Skip to findings</a><div class="page">  <header class="header">    <div>      <div class="brand"><span class="brand-dot"></span>Aloha AI Consulting</div>      <h1 class="doc-title">AI Governance Tracker</h1>      <p class="doc-sub">Five saved searches run once a week across the open web. Findings are listed newest first and are not reviewed before publication.</p>    </div>    <div class="status-pill" role="status" aria-live="polite"><span class="pulse" aria-hidden="true"></span><span id="last-updated">Loading&hellip;</span></div>  </header>  <main id="main-content">  <section class="health-banner" id="collection-health" role="status" aria-live="polite"><div><div class="health-title">Checking when this last collected</div><div class="health-detail">Reading the date of the most recent completed sweep.</div></div><div class="health-state" id="health-state">Checking</div></section>  <div class="stats-row">    <div class="stat-card"><div class="stat-label">Total Items</div><div class="stat-value" id="stat-total">—</div><div class="stat-sub">last 180 days</div></div>    <div class="stat-card"><div class="stat-label">AI Legislation</div><div class="stat-value" id="stat-bills">—</div><div class="stat-sub">items matched</div></div>    <div class="stat-card"><div class="stat-label">FTC Enforcement</div><div class="stat-value" id="stat-ftc">—</div><div class="stat-sub">items matched</div></div>    <div class="stat-card"><div class="stat-label">Saved Searches</div><div class="stat-value" id="stat-sources">5</div><div class="stat-sub">run weekly</div></div>  </div>  <div class="cat-row" id="cat-row"></div>  <h2 class="section-label">Recent findings</h2>  <div class="doc-list" id="doc-list"><div class="no-results" style="padding:60px">Loading findings&hellip;</div></div>  <section class="prose">
    <h2>What the five searches ask</h2>
    <p>The sweep runs at 09:00 UTC every Monday and asks five fixed questions: about Congressional AI legislation, FTC AI enforcement actions, state bar AI ethics guidance, ABA guidance on artificial intelligence and the model rules, and EU AI Act compliance. Each search returns at most ten results published within the previous 180 days. Results are deduplicated by web address before the board is written, so the whole page tops out at fifty findings and normally sits a little below that, because the five searches overlap at the edges.</p>
    <p>Between Mondays the board does not change. The date at the top of the page is when the sweep last ran &mdash; not when anything last happened in AI governance, and not a claim that nothing did.</p>
    <p>Each card shows the headline as its publisher wrote it and the first 300 characters of the page beneath. Neither has been edited, checked or summarised.</p>

    <h2>If you need the document, not the notice</h2>
    <p>This board is a shortcut to public sources that are free, more complete and more current than it is. When what you need is the actual instrument rather than word that one may exist, start at one of these instead:</p>
    <ul>
      <li><a href="https://www.govinfo.gov/app/collection/bills" target="_blank" rel="noopener">govinfo.gov</a> &mdash; the Government Publishing Office&rsquo;s official repository for federal bills and the Federal Register. Full text, free, no account needed.</li>
      <li><a href="https://www.ftc.gov/legal-library/browse/cases-proceedings" target="_blank" rel="noopener">FTC cases and proceedings</a> &mdash; the Commission&rsquo;s own legal library, where an enforcement action exists as a filing rather than as coverage of one.</li>
      <li><a href="https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" target="_blank" rel="noopener">European Commission &mdash; regulatory framework for AI</a> &mdash; the Commission&rsquo;s own account of the AI Act and the dates its obligations take effect.</li>
      <li><a href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener">NIST AI Risk Management Framework</a> &mdash; the reference a great deal of US governance guidance is written against.</li>
      <li>Bar ethics guidance has no national index. The issuing state bar&rsquo;s own opinions page is the only dependable source, and this sweep will miss opinions that are not written about elsewhere.</li>
    </ul>
    <p>A reader who checks those four pages weekly will have a better picture than this board offers, at no cost. What the board adds is narrower and worth stating plainly: the five questions get asked on a fixed schedule, whether or not anyone remembers to ask them, and anything new since the last sweep is in one place when you sit down.</p>
  </section>
  </main>  <footer class="footer">    <div>      <div class="footer-name">RN Collins</div>      <div class="footer-creds">        Neuroscientist &middot; MS Anatomy &amp; Neurobiology, BU School of Medicine<br>        JD Candidate &middot; Northeastern University School of Law<br>        Advanced Legislative Scorer &middot; AISLE Project, Brown University CTR<br>        AI Governance Tracker &mdash; weekly automated web sweep      </div>    </div>    <div class="footer-contact">      <a href="mailto:collins.ra@northeastern.edu?subject=AI%20Governance%20Intelligence%20Layer%20%E2%80%94%20Discovery%20Call%20Request">collins.ra@northeastern.edu</a><br>      <a href="tel:+18606814438">860-681-4438</a><br>      <a href="https://aloha-ai-consulting.vercel.app/" target="_blank" rel="noopener">aloha-ai-consulting.vercel.app</a>    </div>  </footer>  <p class="footer-disclaimer">Findings are collected by automated web search and published without review. They include commentary, law-firm client alerts and vendor material alongside official documents, so treat this as a starting point for research rather than a record of what an agency has done. Not legal advice &mdash; open and verify the primary source before relying on anything here.</p></div><script>let allDocs = [], activeFilter = 'All';function esc(v) { const d = document.createElement('div'); d.appendChild(document.createTextNode(v == null ? '' : String(v))); return d.innerHTML; }function safeUrl(u) { try { const x = new URL(u); return x.protocol === 'https:' ? x.href : null; } catch { return null; } }function badgeClass(cat) {  return cat === 'FTC AI Enforcement' ? 'badge-ftc' : 'badge-congress';}function formatDate(d) {  if (!d) return '';  return new Date(d + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });}function renderDocs(docs) {  const list = document.getElementById('doc-list');  if (!docs.length) { list.innerHTML = '<div class="no-results">No items match this filter.</div>'; return; }  list.innerHTML = docs.map(d => { const u = safeUrl(d.url); const host = u ? new URL(u).hostname.replace(/^www\\./, '') : 'source unavailable'; const inner = '<div class="badge ' + badgeClass(d.category) + '" aria-hidden="true">' + esc(d.source) + '</div><div><div class="doc-title-text">' + esc(d.title) + '</div><div class="doc-meta">' + esc(host) + ' &nbsp;&middot;&nbsp; ' + esc(formatDate(d.date) || 'date not supplied') + '</div>' + (d.abstract ? '<div class="doc-abstract">' + esc(d.abstract) + (d.abstract.length >= 300 ? '&hellip;' : '') + '</div>' : '') + '</div>'; return u ? '<a class="doc-card" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>' : '<div class="doc-card">' + inner + '</div>'; }).join('');}function setFilter(cat) {  activeFilter = cat;  document.querySelectorAll('.cat-pill').forEach(p => {    p.classList.toggle('active', p.dataset.cat === cat);    p.classList.toggle('inactive', p.dataset.cat !== cat);    p.setAttribute('aria-pressed', p.dataset.cat === cat ? 'true' : 'false');  });  renderDocs(cat === 'All' ? allDocs : allDocs.filter(d => d.category === cat));}async function load() {  try {    const res = await fetch('/api/data');    const data = await res.json();    if (!data.ok) throw new Error(data.error);    allDocs = data.documents || [];    document.getElementById('stat-total').textContent = data.total;    document.getElementById('stat-bills').textContent = data.bill_count;    document.getElementById('stat-ftc').textContent = data.ftc_count;    const health = data.collection_health || {};    const box = document.getElementById('collection-health');    const state = health.stale ? 'stale' : (health.status || 'unknown');    box.classList.remove('current','stale','degraded','failed');    box.classList.add(state);    document.getElementById('health-state').textContent = state === 'current' ? 'Current' : state === 'stale' ? 'Overdue' : state === 'degraded' ? 'Degraded' : 'Unknown';    const collected = health.last_collection ? new Date(health.last_collection) : null;    const collectedText = collected ? collected.toLocaleDateString('en-US', { dateStyle: 'medium' }) : null;    box.querySelector('.health-title').textContent = state === 'current' ? 'Collection is up to date' : state === 'stale' ? 'Collection is overdue' : state === 'degraded' ? 'Last collection was incomplete' : 'Collection status unknown';    const bits = [];    bits.push(collectedText ? 'Last completed sweep ' + collectedText + (health.age_days != null ? ' (' + health.age_days + ' day' + (health.age_days === 1 ? '' : 's') + ' ago).' : '.') : 'No completed sweep has been recorded.');    if (health.newest_item_date) bits.push('Newest finding is dated ' + formatDate(health.newest_item_date) + '.');    bits.push(health.cadence || 'Weekly cadence.');    if (health.stale) bits.push('Nothing below has been refreshed since that date; it is not a current picture.');    if (health.failed_searches) bits.push(health.failed_searches + ' of 5 searches failed on that run.');    box.querySelector('.health-detail').textContent = bits.join(' ');    document.getElementById('last-updated').textContent = collected ? (health.stale ? 'Overdue \u00b7 last ' : 'Updated ') + collected.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Never collected';    if (health.stale) { const pulse = document.querySelector('.pulse'); if (pulse) { pulse.style.background = '#A93B22'; pulse.style.animation = 'none'; } }    const cats = ['All', ...Object.keys(data.categories || {}).sort()];    document.getElementById('cat-row').innerHTML = cats.map(c => {      const count = c === 'All' ? allDocs.length : (data.categories?.[c] || 0);      return '<button type="button" class="cat-pill ' + (c === 'All' ? 'active' : 'inactive') + '" data-cat="' + esc(c) + '" aria-pressed="' + (c === 'All' ? 'true' : 'false') + '">' + esc(c) + ' (' + count + ')</button>';    }).join('');    document.querySelectorAll('.cat-pill').forEach(b => b.addEventListener('click', () => setFilter(b.dataset.cat)));    renderDocs(allDocs);  } catch (err) {    document.getElementById('doc-list').innerHTML = '<div class="no-results">The findings feed is unavailable, so nothing is shown. Cached numbers are deliberately not displayed &mdash; consult the agencies directly and retry later.</div>';    document.getElementById('last-updated').textContent = 'Status unavailable';    const box = document.getElementById('collection-health');    box.classList.add('failed');    box.querySelector('.health-title').textContent = 'Cannot confirm freshness';    box.querySelector('.health-detail').textContent = 'The feed did not respond, so this page cannot say when it last collected. Do not treat anything here as current.';    document.getElementById('health-state').textContent = 'Failed';    const pulse = document.querySelector('.pulse'); if (pulse) { pulse.style.background = '#A93B22'; pulse.style.animation = 'none'; }  }}load();</script></body></html>`;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
