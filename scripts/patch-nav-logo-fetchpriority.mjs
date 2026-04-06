import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const oldImg =
  '<img class="nav-brand-logo" src="assets/img/logo.svg" alt="CraftedPixel" width="421" height="86" decoding="async" />';
const newImg =
  '<img class="nav-brand-logo" src="assets/img/logo.svg" alt="CraftedPixel" width="421" height="86" decoding="async" fetchpriority="high" />';

for (const name of fs.readdirSync(root)) {
  if (!name.endsWith(".html")) continue;
  const fp = path.join(root, name);
  let t = fs.readFileSync(fp, "utf8");
  if (!t.includes(oldImg)) continue;
  fs.writeFileSync(fp, t.replaceAll(oldImg, newImg), "utf8");
  console.log("OK", name);
}
