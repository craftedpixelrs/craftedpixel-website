import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const faSync =
  /  <link rel="stylesheet" href="css\/fontawesome\.min\.css" \/>/g;
const faAsync = `  <link rel="preload" href="css/fontawesome.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
  <noscript><link rel="stylesheet" href="css/fontawesome.min.css" /></noscript>`;

const lucideOld = "https://unpkg.com/lucide@latest/dist/umd/lucide.js";
const lucideNew = "https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js";

for (const name of fs.readdirSync(root)) {
  if (!name.endsWith(".html")) continue;
  const fp = path.join(root, name);
  let t = fs.readFileSync(fp, "utf8");
  let n = t.replace(faSync, faAsync);
  n = n.replaceAll(lucideOld, lucideNew);
  if (n !== t) {
    fs.writeFileSync(fp, n, "utf8");
    console.log("OK", name);
  } else {
    console.log("SKIP", name);
  }
}
