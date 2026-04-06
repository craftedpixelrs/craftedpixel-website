import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const re =
  /<script>\s*document\.addEventListener\('DOMContentLoaded',\s*function\s*\(\)\s*\{\s*if\s*\(typeof lucide[^}]+\}\);\s*<\/script>/gs;

const replacement = `<script>
    (function () {
      function initLucide() {
        if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
      }
      if ('requestIdleCallback' in window) {
        requestIdleCallback(initLucide, { timeout: 2000 });
      } else {
        window.addEventListener('load', initLucide);
      }
    })();
  </script>`;

for (const name of fs.readdirSync(root)) {
  if (!name.endsWith(".html")) continue;
  const fp = path.join(root, name);
  let t = fs.readFileSync(fp, "utf8");
  const n = t.replace(re, replacement);
  if (n !== t) {
    fs.writeFileSync(fp, n, "utf8");
    console.log("OK", name);
  }
}
