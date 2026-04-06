import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const privacyPreload = /\r?\n  <link rel="preload" href="js\/privacy-notice\.js" as="script" \/>/g;

const lucideCdn =
  "https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js";
const lucideLocal = "js/lucide.min.js";

for (const name of fs.readdirSync(root)) {
  if (!name.endsWith(".html")) continue;
  const fp = path.join(root, name);
  let t = fs.readFileSync(fp, "utf8");
  const before = t;
  t = t.replace(privacyPreload, "\n");
  t = t.replaceAll(
    `<script defer src="${lucideCdn}"></script>`,
    `<script defer src="${lucideLocal}"></script>`
  );
  if (t !== before) fs.writeFileSync(fp, t, "utf8");
  console.log(t !== before ? "OK" : "SKIP", name);
}
