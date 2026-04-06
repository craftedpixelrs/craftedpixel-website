import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const a = '<link rel="preload" href="css/main.min.css" as="style" />';
const b = '<link rel="preload" href="css/main.min.css" as="style" fetchpriority="high" />';

for (const name of fs.readdirSync(root)) {
  if (!name.endsWith(".html")) continue;
  const fp = path.join(root, name);
  let t = fs.readFileSync(fp, "utf8");
  if (!t.includes(a)) continue;
  fs.writeFileSync(fp, t.split(a).join(b), "utf8");
  console.log("OK", name);
}
