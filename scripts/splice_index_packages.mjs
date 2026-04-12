import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const p = path.join(root, "index.html");
let t = fs.readFileSync(p, "utf8");
const a = t.indexOf("  <!-- PACKAGES -->");
const b = t.indexOf("  <!-- TECH STACK", a);
if (a < 0 || b < 0) throw new Error("markers not found");

const teaser = `  <!-- PACKAGES TEASER -->
  <section class="packages packages--teaser has-geo tex-iso" id="packages">
    <div class="geo geo-circle c-blue geo-f1" style="width:44px;height:44px;top:14%;right:6%"></div>
    <div class="geo geo-diamond c-navy geo-f2" style="width:22px;height:22px;bottom:18%;left:5%"></div>
    <div class="geo geo-tri c-violet geo-f1" style="--tri-s:14px;top:45%;left:3%"></div>
    <div class="container">
      <div class="packages-intro" style="text-align:center">
        <div data-anim="fade-up"><span class="section-label">Pricing</span></div>
        <h2 class="section-heading" data-anim="fade-up" data-delay="1">Simple pricing. No games.</h2>
        <p class="section-sub" data-anim="fade-up" data-delay="2" style="margin-left:auto;margin-right:auto;text-align:center;max-width:52ch">Four clear tiers per service line—each with a detailed comparison table on our dedicated pricing page.</p>
        <p class="packages-expectations-note" data-anim="fade-up" data-delay="3">Numbers are <strong>starting points</strong> until we align scope—see <a href="how-we-work#pricing-expectations">what drives the final quote</a> and the <a href="how-we-work#after-email">timeline from your first email</a>.</p>
        <div class="packages-teaser-cta" data-anim="fade-up" data-delay="4" style="margin-top:28px;display:flex;flex-wrap:wrap;gap:14px;justify-content:center;align-items:center">
          <a href="pricing" class="button button--primary">
            <span>View full pricing</span>
            <span class="button__icon-wrapper" aria-hidden="true">
              <i class="fa-solid fa-table-cells-large button__icon-svg"></i>
              <i class="fa-solid fa-table-cells-large button__icon-svg button__icon-svg--copy"></i>
            </span>
          </a>
          <a href="contact" class="button button--secondary">
            <span>Get a quote</span>
            <span class="button__icon-wrapper" aria-hidden="true">
              <i class="fa-solid fa-paper-plane button__icon-svg"></i>
              <i class="fa-solid fa-paper-plane button__icon-svg button__icon-svg--copy"></i>
            </span>
          </a>
        </div>
        <p class="packages-teaser-hint">Jump to a service tab: <a href="pricing#uiux">UI/UX</a> · <a href="pricing#webdev">Web dev</a> · <a href="pricing#seo">SEO</a> · <a href="pricing#brand">Brand</a> · <a href="pricing#cms">CMS</a> · <a href="pricing#analytics">Analytics</a>.</p>
      </div>
    </div>
  </section>

`;

t = t.slice(0, a) + teaser + t.slice(b);
fs.writeFileSync(p, t, "utf8");
console.log("index.html packages → teaser");
