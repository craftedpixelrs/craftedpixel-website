/**
 * LCP / main-thread tweaks across HTML (run from repo root: node scripts/patch-perf-lcp.mjs).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const oldLucide = `  <script>
    document.addEventListener('DOMContentLoaded', function () {
      if (typeof lucide !== 'undefined' && lucide.createIcons) lucide.createIcons();
    });
  </script>`;

const newLucide = `  <script>
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

const oldSyne =
  '<link rel="preload" href="https://fonts.gstatic.com/s/syne/v24/8vIH7w4qzmVxm2BL9A.woff2" as="font" type="font/woff2" crossorigin />';
const newSyne =
  '<link rel="preload" href="https://fonts.gstatic.com/s/syne/v24/8vIH7w4qzmVxm2BL9A.woff2" as="font" type="font/woff2" crossorigin fetchpriority="high" />';

const navLogoOld =
  '<img class="nav-brand-logo" src="assets/img/logo.svg" alt="CraftedPixel" width="421" height="86" decoding="async" fetchpriority="high" />';
const navLogoNew =
  '<img class="nav-brand-logo" src="assets/img/logo.svg" alt="CraftedPixel" width="421" height="86" decoding="async" fetchpriority="high" loading="eager" />';

for (const name of fs.readdirSync(root)) {
  if (!name.endsWith(".html")) continue;
  const fp = path.join(root, name);
  let t = fs.readFileSync(fp, "utf8");
  const before = t;
  t = t.replace(oldLucide, newLucide);
  t = t.replace(oldSyne, newSyne);
  t = t.replace(navLogoOld, navLogoNew);
  if (name === "index.html") {
    t = t.replace("<body>", '<body class="page-home">');
  }
  if (t !== before) {
    fs.writeFileSync(fp, t, "utf8");
    console.log("OK", name);
  }
}
