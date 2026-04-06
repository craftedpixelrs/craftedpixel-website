import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const re =
  /  <link rel="preload" href="https:\/\/fonts\.googleapis\.com\/css2\?family=Instrument\+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Syne:wght@400;500;600;700;800&display=swap" as="style" onload="this\.onload=null;this\.rel='stylesheet'" \/>\r?\n  <noscript><link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2\?family=Instrument\+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Syne:wght@400;500;600;700;800&display=swap" \/><\/noscript>/g;
const rep = `  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&amp;family=Syne:wght@400;500;600;700;800&amp;display=swap" />`;

for (const f of fs.readdirSync(root).filter((x) => x.endsWith('.html'))) {
  const p = path.join(root, f);
  let t = fs.readFileSync(p, 'utf8');
  const n = t.replace(re, rep);
  if (n !== t) {
    fs.writeFileSync(p, n);
    console.log(f);
  }
}
