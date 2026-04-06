import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const old = /  <link rel="preload" href="css\/main.min.css" as="style" fetchpriority="high" \/>\r?\n  <link rel="stylesheet" href="css\/main.min.css" \/>/g;
const rep = `  <link rel="preload" href="css/main.min.css" as="style" fetchpriority="high" onload="this.onload=null;this.rel='stylesheet'" />
  <noscript><link rel="stylesheet" href="css/main.min.css" /></noscript>`;

for (const f of fs.readdirSync(root).filter((x) => x.endsWith('.html'))) {
  const p = path.join(root, f);
  let t = fs.readFileSync(p, 'utf8');
  const n = t.replace(old, rep);
  if (n !== t) {
    fs.writeFileSync(p, n);
    console.log(f);
  }
}
