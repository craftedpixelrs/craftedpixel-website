/**
 * patch-google-fonts-to-local.mjs
 *
 * Run AFTER setup-self-hosted-fonts.sh has downloaded the woff2 files and
 * generated css/fonts.css.
 *
 * What it does in every *.html:
 *   - Removes the two <link rel="preconnect" href="https://fonts.googleapis.com/...">
 *   - Removes the Google Fonts preload / noscript block
 *   - Removes the gstatic preload lines for Syne + Instrument Sans
 *   - Inserts  <link rel="preload" href="css/fonts.css" as="style" fetchpriority="high" />
 *             <link rel="stylesheet" href="css/fonts.css" />
 *   - Inserts  <link rel="preload" href="assets/fonts/syne-400.woff2" ...>
 *             <link rel="preload" href="assets/fonts/instrument-sans-400.woff2" ...>
 *
 * Usage: node scripts/patch-google-fonts-to-local.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// ── Patterns to remove ────────────────────────────────────────────────────────
const REMOVE = [
  // preconnect to googleapis / gstatic
  /\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"[^>]*\/>\r?\n?/g,
  /\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com"[^>]*\/>\r?\n?/g,
  // gstatic woff2 preloads (Syne + Instrument Sans)
  /\s*<link rel="preload" href="https:\/\/fonts\.gstatic\.com\/s\/syne\/[^"]*"[^>]*\/>\r?\n?/g,
  /\s*<link rel="preload" href="https:\/\/fonts\.gstatic\.com\/s\/instrumentsans\/[^"]*"[^>]*\/>\r?\n?/g,
  // Google Fonts async preload + noscript block
  /\s*<link rel="preload" href="https:\/\/fonts\.googleapis\.com\/[^"]*" as="style"[^>]*\/>\r?\n?\s*<noscript>.*?<\/noscript>\r?\n?/gs,
  // fallback: plain blocking stylesheet (in case some pages still have it)
  /\s*<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/[^"]*"[^>]*\/>\r?\n?/g,
];

// ── What to insert (right before </head> or before the first <style> in <head>) ──
const INSERT_AFTER_PRECONNECT_ANCHOR = `  <link rel="preload" href="css/fonts.css" as="style" fetchpriority="high" />
  <link rel="preload" href="assets/fonts/syne-400.woff2" as="font" type="font/woff2" crossorigin fetchpriority="high" />
  <link rel="preload" href="assets/fonts/instrument-sans-400.woff2" as="font" type="font/woff2" crossorigin fetchpriority="high" />
  <link rel="stylesheet" href="css/fonts.css" />`;

// Insert after the charset / viewport meta block, before the first <link> or <title>
const INSERT_RE = /(<meta name="viewport"[^>]*\/>)/;

let changed = 0;
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
  const filePath = path.join(root, file);
  let text = fs.readFileSync(filePath, 'utf8');
  const original = text;

  // Remove Google Fonts references
  for (const re of REMOVE) {
    text = text.replace(re, '');
  }

  // Insert local font block after viewport meta
  if (!text.includes('css/fonts.css') && INSERT_RE.test(text)) {
    text = text.replace(INSERT_RE, `$1\n${INSERT_AFTER_PRECONNECT_ANCHOR}`);
  }

  if (text !== original) {
    fs.writeFileSync(filePath, text, 'utf8');
    console.log(`Patched: ${file}`);
    changed++;
  }
}

console.log(`\nDone — ${changed} / ${htmlFiles.length} files updated.`);
console.log('Deploy assets/fonts/ + css/fonts.css + *.html to VPS.');
