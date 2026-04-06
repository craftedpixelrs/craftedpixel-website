import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const idxText = fs.readFileSync(path.join(root, "index.html"), "utf8");

const a = idxText.indexOf("  <!-- PACKAGES -->");
const b = idxText.indexOf("  <!-- TECH STACK", a);
let pkg = idxText.slice(a, b);
pkg = pkg.replace('id="packages"', 'id="pricing-packages"', 1);
pkg = pkg.replace(
  '<h2 class="section-heading" data-anim="fade-up" data-delay="1">Simple pricing. No games.</h2>',
  '<h2 class="section-heading" data-anim="fade-up" data-delay="1">Simple pricing—full comparison</h2>'
);
pkg = pkg.replace(
  "Four clear tiers per service—aligned with what we actually deliver. Final scope after a short call.",
  "Four tiers per service line. Below each set of cards, a matrix shows what's in scope, what's not, and what's typically an add-on."
);

const Y = () =>
  '<td><span class="pricing-compare-cell pricing-compare-cell--yes" aria-label="Included"><i class="fa-solid fa-check"></i></span></td>';
const N = () =>
  '<td><span class="pricing-compare-cell pricing-compare-cell--no" aria-label="Not included">—</span></td>';
const ADD = (t = "Add-on") =>
  `<td><span class="pricing-compare-cell pricing-compare-cell--addon">${t}</span></td>`;
const PAR = (t = "Partial") =>
  `<td><span class="pricing-compare-cell pricing-compare-cell--partial">${t}</span></td>`;

const serviceHref = (slug) =>
  ({
    uiux: "service-ui-ux.html",
    webdev: "service-web-development.html",
    seo: "service-seo-growth.html",
    brand: "service-brand-design-systems.html",
    cms: "service-content-cms.html",
    analytics: "service-analytics-experimentation.html",
  }[slug]);

function tableHtml(caption, slug, columns, rows) {
  const y = Y();
  const n = N();
  const thead =
    '<thead><tr><th scope="col">Capability</th>' +
    columns.map((c) => `<th scope="col">${c}</th>`).join("") +
    "</tr></thead>";
  let body = "<tbody>";
  for (const [feat, c1, c2, c3, c4] of rows) {
    body += `<tr><th scope="row">${feat}</th>${c1}${c2}${c3}${c4}</tr>`;
  }
  body += "</tbody>";
  const lede =
    '              <p class="pricing-compare-lede">Columns match the cards above, left to right. ' +
    `<a href="${serviceHref(slug)}">Service page</a> · ` +
    '<a href="how-we-work.html#pricing-expectations">What moves the quote</a> · ' +
    '<a href="contact.html">Contact</a> · ' +
    `<a href="pricing.html#${slug}">Direct link to this tab</a>.</p>\n`;
  return (
    `\n            <div class="pricing-compare-wrap" id="compare-${slug}">\n` +
    `              <h3 class="pricing-compare-title">${caption}</h3>\n` +
    lede +
    '              <div class="pricing-compare-scroll" role="region" aria-label="Package comparison" tabindex="0">\n' +
    '                <table class="pricing-compare-table">\n' +
    `                  ${thead}\n${body}\n` +
    "                </table>\n" +
    "              </div>\n" +
    "            </div>\n"
  );
}

const tables = {
  uiux: tableHtml(
    "UI/UX — what's included by package",
    "uiux",
    ["UX snapshot", "Flow sprint", "Surface overhaul", "UX retainer"],
    [
      ["Heuristic review & written report", Y(), PAR("In prototype scope"), PAR("Surface scope"), Y()],
      ["User flows & information architecture", N(), Y(), Y(), Y()],
      ["Wireframes & Figma prototype", N(), Y(), Y(), Y()],
      ["Full UI slice / component kit", N(), ADD(), Y(), Y()],
      ["Accessibility & consistency pass", Y(), Y(), Y(), Y()],
      ["Design QA on staging", N(), N(), Y(), Y()],
      ["User research / usability tests", N(), ADD("5-user block"), PAR("As agreed"), Y()],
      ["Slack + monthly hour pool", N(), N(), N(), Y()],
    ]
  ),
  webdev: tableHtml(
    "Web development — what's included by package",
    "webdev",
    ["Launch slice", "Marketing site", "Web app MVP", "Dev cadence"],
    [
      ["Production deploy + CI previews", Y(), Y(), Y(), Y()],
      ["Marketing site templates & CMS", N(), Y(), PAR("Scope-based"), Y()],
      ["Auth, data layer, API integration", N(), PAR("Forms/hooks"), Y(), Y()],
      ["Tests for critical paths", PAR("Baseline"), Y(), Y(), Y()],
      ["Core Web Vitals / performance budget", Y(), Y(), Y(), Y()],
      ["Post-launch support window", Y(), PAR("As contracted"), Y(), Y()],
      ["Bi-weekly demos & shared backlog", N(), N(), N(), Y()],
    ]
  ),
  seo: tableHtml(
    "SEO & growth — what's included by package",
    "seo",
    ["Technical SEO", "Launch kit", "Organic 90", "SEO retainer"],
    [
      ["Technical audit + prioritized backlog", Y(), PAR("In kit"), Y(), Y()],
      ["Keyword map & on-page metadata", N(), Y(), Y(), Y()],
      ["GA4 / GTM foundation", PAR("Recommendations"), Y(), Y(), Y()],
      ["Search Console & indexation fixes", Y(), Y(), Y(), Y()],
      ["Content briefs / outlines", N(), PAR("Limited set"), Y(), Y()],
      ["Monthly performance reviews", N(), N(), Y(), Y()],
      ["Ongoing monitoring & fixes", N(), N(), PAR("Program"), Y()],
    ]
  ),
  brand: tableHtml(
    "Brand — what's included by package",
    "brand",
    ["Logo &amp; essentials", "Brand toolkit", "Product design system", "Brand rollout"],
    [
      ["Logo, palette, type pairing", Y(), Y(), PAR("Extended system"), Y()],
      ["Brand guidelines PDF / one-pager", N(), Y(), Y(), Y()],
      ["Figma component library + docs", N(), PAR("Templates"), Y(), Y()],
      ["Social covers & slide master", N(), Y(), PAR("In system"), Y()],
      ["Stakeholder workshops", N(), PAR("Async-first"), PAR("Live sessions"), Y()],
      ["Naming / verbal identity program", N(), N(), ADD(), Y()],
    ]
  ),
  cms: tableHtml(
    "Content &amp; CMS — what's included by package",
    "cms",
    ["Content schema sprint", "CMS build &amp; migrate", "API + preview stack", "Editorial platform"],
    [
      ["Content model, fields, editor UX", Y(), Y(), Y(), Y()],
      ["Content migration & redirects", N(), Y(), PAR("Larger sets"), Y()],
      ["Roles, workflows, training", Y(), Y(), Y(), Y()],
      ["Headless / preview / webhooks", N(), PAR("Standard"), Y(), Y()],
      ["Performance (cache, CDN hooks)", N(), Y(), Y(), Y()],
      ["SSO, RBAC, audit trail", N(), N(), ADD(), Y()],
    ]
  ),
  analytics: tableHtml(
    "Analytics — what's included by package",
    "analytics",
    ["Measurement setup", "Funnel intelligence", "Experiment quarter", "Data partnership"],
    [
      ["GA4 / GTM implementation", Y(), Y(), Y(), Y()],
      ["Executive dashboards", N(), Y(), PAR("Readouts"), Y()],
      ["Experiment design & readouts", N(), PAR("One stream"), Y(), Y()],
      ["Monthly tagging QA & release checks", N(), N(), N(), Y()],
      ["Consent / privacy baseline", Y(), Y(), Y(), Y()],
      ["CRM / warehouse hooks", N(), N(), ADD(), Y()],
    ]
  ),
};

const replacements = [
  [
    '            </div>\n          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-webdev"',
    "            </div>\n" + tables.uiux + '          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-webdev"',
  ],
  [
    '            </div>\n          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-seo"',
    "            </div>\n" + tables.webdev + '          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-seo"',
  ],
  [
    '            </div>\n          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-brand"',
    "            </div>\n" + tables.seo + '          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-brand"',
  ],
  [
    '            </div>\n          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-cms"',
    "            </div>\n" + tables.brand + '          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-cms"',
  ],
  [
    '            </div>\n          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-analytics"',
    "            </div>\n" + tables.cms + '          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-analytics"',
  ],
  [
    "            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>",
    "            </div>\n" + tables.analytics + "          </div>\n        </div>\n      </div>\n    </div>\n  </section>",
  ],
];

for (const [old, neu] of replacements) {
  if (!pkg.includes(old)) throw new Error("Anchor not found: " + old.slice(0, 70));
  pkg = pkg.replace(old, neu);
}

const bodyStart = idxText.indexOf("<body>");
const heroMarker = "  <!-- HERO -->";
const heroIdx = idxText.indexOf(heroMarker);
let top = idxText.slice(0, bodyStart);
top = top.replace(
  /<title>.*?<\/title>/s,
  "<title>Pricing — CraftedPixel | Packages by service line</title>"
);
top = top.replace(
  /<meta name="description" content="[^"]*"\s*\/>/,
  '<meta name="description" content="CraftedPixel pricing: four packages each for UI/UX, web development, SEO, brand, CMS, and analytics—with comparison tables for scope." />'
);
top = top.replace(
  /<link rel="canonical" href="[^"]*"\s*\/>/,
  '<link rel="canonical" href="https://craftedpixel.com/pricing.html" />'
);

let navBlock = idxText.slice(bodyStart, heroIdx);
navBlock = navBlock.replace('href="#hero"', 'href="index.html"', 1);

const hero = `
  <header class="page-hero has-geo" aria-labelledby="pricing-hero-title">
    <div class="hero-bg" aria-hidden="true">
      <div class="hero-bg-grid"></div>
      <div class="hero-bg-orb hero-bg-orb--1"></div>
      <div class="hero-bg-orb hero-bg-orb--2"></div>
      <div class="hero-bg-orb hero-bg-orb--3"></div>
      <div class="hero-bg-shine"></div>
    </div>
    <div class="geo geo-circle c-navy geo-f1" style="width:38px;height:38px;top:20%;left:6%"></div>
    <div class="geo geo-square c-blue geo-f2" style="width:24px;height:24px;top:36%;right:7%"></div>
    <div class="geo geo-tri c-teal geo-f1" style="--tri-s:13px;bottom:26%;left:5%"></div>
    <div class="geo geo-ring c-navy geo-spin" style="width:56px;height:56px;bottom:16%;right:9%"></div>
    <div class="container">
      <p class="page-hero-crumb"><a href="index.html">Home</a> / Pricing</p>
      <span class="section-label">Pricing</span>
      <h1 id="pricing-hero-title" class="page-hero-title">Packages by service—with a clear scope matrix.</h1>
      <p class="page-hero-lede">Pick a tab to see four tiers and a comparison table underneath. Numbers are starting points until we align scope on a short call.</p>
      <div class="page-hero-aux" style="margin-top:1rem">
        <a href="how-we-work.html#pricing-expectations">How we price</a>
        · <a href="services.html">All services</a>
        · <a href="contact.html">Get a quote</a>
      </div>
    </div>
  </header>

  <main id="main-content">
`;

const footerStart = idxText.indexOf("  <!-- FOOTER -->");
let footerAndScripts = idxText.slice(footerStart);
const hashScript = `
  <script>
    (function () {
      var h = (location.hash || '').replace(/^#/, '');
      if (!/^(uiux|webdev|seo|brand|cms|analytics)$/.test(h)) return;
      var tab = document.querySelector('.packages-tab[data-tab="' + h + '"]');
      if (tab) { tab.click(); tab.focus(); }
    })();
  </script>
`;
footerAndScripts = footerAndScripts.replace("</body>", hashScript + "\n</body>", 1);

const out =
  top +
  navBlock +
  hero +
  pkg +
  "\n  </main>\n\n" +
  footerAndScripts;

fs.writeFileSync(path.join(root, "pricing.html"), out, "utf8");
console.log("Wrote pricing.html");
