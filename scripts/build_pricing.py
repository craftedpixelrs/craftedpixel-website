"""Build pricing.html from index packages section + comparison tables."""
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
idx_text = (root / "index.html").read_text(encoding="utf-8")

a = idx_text.index("  <!-- PACKAGES -->")
b = idx_text.index("  <!-- TECH STACK", a)
pkg = idx_text[a:b]
pkg = pkg.replace('id="packages"', 'id="pricing-packages"', 1)

# English microcopy for pricing page (cards stay as in index)
pkg = pkg.replace(
    '<h2 class="section-heading" data-anim="fade-up" data-delay="1">Simple pricing. No games.</h2>',
    '<h2 class="section-heading" data-anim="fade-up" data-delay="1">Simple pricing—full comparison</h2>',
)
pkg = pkg.replace(
    'Four clear tiers per service—aligned with what we actually deliver. Final scope after a short call.',
    "Four tiers per service line. Below each set of cards, a matrix shows what's in scope, what's not, and what's typically an add-on.",
)


def Y():
    return '<td><span class="pricing-compare-cell pricing-compare-cell--yes" aria-label="Included"><i class="fa-solid fa-check"></i></span></td>'


def N():
    return '<td><span class="pricing-compare-cell pricing-compare-cell--no" aria-label="Not included">—</span></td>'


def ADD(t="Add-on"):
    return f'<td><span class="pricing-compare-cell pricing-compare-cell--addon">{t}</span></td>'


def PAR(t="Partial"):
    return f'<td><span class="pricing-compare-cell pricing-compare-cell--partial">{t}</span></td>'


def service_href(slug):
    return {
        "uiux": "service-ui-ux",
        "webdev": "service-web-development",
        "seo": "service-seo-growth",
        "brand": "service-brand-design-systems",
        "cms": "service-content-cms",
        "analytics": "service-analytics-experimentation",
    }[slug]


def table_html(caption, slug, columns, rows):
    y, n = Y(), N()
    thead = (
        "<thead><tr><th scope=\"col\">Capability</th>"
        + "".join(f'<th scope="col">{c}</th>' for c in columns)
        + "</tr></thead>"
    )
    body = "<tbody>"
    for feat, c1, c2, c3, c4 in rows:
        body += f"<tr><th scope=\"row\">{feat}</th>{c1}{c2}{c3}{c4}</tr>"
    body += "</tbody>"
    lede = (
        '              <p class="pricing-compare-lede">Columns match the cards above, left to right. '
        f'<a href="{service_href(slug)}">Service page</a> · '
        '<a href="how-we-work#pricing-expectations">What moves the quote</a> · '
        '<a href="contact">Contact</a> · '
        f'<a href="pricing#{slug}">Direct link to this tab</a>.</p>\n'
    )
    return (
        f'\n            <div class="pricing-compare-wrap" id="compare-{slug}">\n'
        f'              <h3 class="pricing-compare-title">{caption}</h3>\n'
        + lede
        + '              <div class="pricing-compare-scroll" role="region" aria-label="Package comparison" tabindex="0">\n'
        + '                <table class="pricing-compare-table">\n'
        + f"                  {thead}\n{body}\n"
        + "                </table>\n"
        + "              </div>\n"
        + "            </div>\n"
    )


tables = {
    "uiux": table_html(
        "UI/UX — what's included by package",
        "uiux",
        ["UX snapshot", "Flow sprint", "Surface overhaul", "UX retainer"],
        [
            ("Heuristic review & written report", y, PAR("In prototype scope"), PAR("Surface scope"), y),
            ("User flows & information architecture", n, y, y, y),
            ("Wireframes & Figma prototype", n, y, y, y),
            ("Full UI slice / component kit", n, ADD(), y, y),
            ("Accessibility & consistency pass", y, y, y, y),
            ("Design QA on staging", n, n, y, y),
            ("User research / usability tests", n, ADD("5-user block"), PAR("As agreed"), y),
            ("Slack + monthly hour pool", n, n, n, y),
        ],
    ),
    "webdev": table_html(
        "Web development — what's included by package",
        "webdev",
        ["Launch slice", "Marketing site", "Web app MVP", "Dev cadence"],
        [
            ("Production deploy + CI previews", y, y, y, y),
            ("Marketing site templates & CMS", n, y, PAR("Scope-based"), y),
            ("Auth, data layer, API integration", n, PAR("Forms/hooks"), y, y),
            ("Tests for critical paths", PAR("Baseline"), y, y, y),
            ("Core Web Vitals / performance budget", y, y, y, y),
            ("Post-launch support window", y, PAR("As contracted"), y, y),
            ("Bi-weekly demos & shared backlog", n, n, n, y),
        ],
    ),
    "seo": table_html(
        "SEO & growth — what's included by package",
        "seo",
        ["Technical SEO", "Launch kit", "Organic 90", "SEO retainer"],
        [
            ("Technical audit + prioritized backlog", y, PAR("In kit"), y, y),
            ("Keyword map & on-page metadata", n, y, y, y),
            ("GA4 / GTM foundation", PAR("Recommendations"), y, y, y),
            ("Search Console & indexation fixes", y, y, y, y),
            ("Content briefs / outlines", n, PAR("Limited set"), y, y),
            ("Monthly performance reviews", n, n, y, y),
            ("Ongoing monitoring & fixes", n, n, PAR("Program"), y),
        ],
    ),
    "brand": table_html(
        "Brand — what's included by package",
        "brand",
        ["Logo &amp; essentials", "Brand toolkit", "Product design system", "Brand rollout"],
        [
            ("Logo, palette, type pairing", y, y, PAR("Extended system"), y),
            ("Brand guidelines PDF / one-pager", n, y, y, y),
            ("Figma component library + docs", n, PAR("Templates"), y, y),
            ("Social covers & slide master", n, y, PAR("In system"), y),
            ("Stakeholder workshops", n, PAR("Async-first"), PAR("Live sessions"), y),
            ("Naming / verbal identity program", n, n, ADD(), y),
        ],
    ),
    "cms": table_html(
        "Content &amp; CMS — what's included by package",
        "cms",
        ["Content schema sprint", "CMS build &amp; migrate", "API + preview stack", "Editorial platform"],
        [
            ("Content model, fields, editor UX", y, y, y, y),
            ("Content migration & redirects", n, y, PAR("Larger sets"), y),
            ("Roles, workflows, training", y, y, y, y),
            ("Headless / preview / webhooks", n, PAR("Standard"), y, y),
            ("Performance (cache, CDN hooks)", n, y, y, y),
            ("SSO, RBAC, audit trail", n, n, ADD(), y),
        ],
    ),
    "analytics": table_html(
        "Analytics — what's included by package",
        "analytics",
        ["Measurement setup", "Funnel intelligence", "Experiment quarter", "Data partnership"],
        [
            ("GA4 / GTM implementation", y, y, y, y),
            ("Executive dashboards", n, y, PAR("Readouts"), y),
            ("Experiment design & readouts", n, PAR("One stream"), y, y),
            ("Monthly tagging QA & release checks", n, n, n, y),
            ("Consent / privacy baseline", y, y, y, y),
            ("CRM / warehouse hooks", n, n, ADD(), y),
        ],
    ),
}

replacements = [
    (
        '            </div>\n          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-webdev"',
        "            </div>\n" + tables["uiux"] + '          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-webdev"',
    ),
    (
        '            </div>\n          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-seo"',
        "            </div>\n" + tables["webdev"] + '          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-seo"',
    ),
    (
        '            </div>\n          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-brand"',
        "            </div>\n" + tables["seo"] + '          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-brand"',
    ),
    (
        '            </div>\n          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-cms"',
        "            </div>\n" + tables["brand"] + '          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-cms"',
    ),
    (
        '            </div>\n          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-analytics"',
        "            </div>\n" + tables["cms"] + '          </div>\n\n          <div class="packages-tab-panel" id="pkg-panel-analytics"',
    ),
    (
        "            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>",
        "            </div>\n" + tables["analytics"] + "          </div>\n        </div>\n      </div>\n    </div>\n  </section>",
    ),
]

for old, new in replacements:
    if old not in pkg:
        raise SystemExit(f"Anchor not found for replacement starting: {old[:70]!r}")
    pkg = pkg.replace(old, new, 1)

body_start = idx_text.index("<body>")
hero_marker = "  <!-- HERO -->"
hero_idx = idx_text.index(hero_marker)
top = idx_text[:body_start]
top = re.sub(
    r"<title>.*?</title>",
    "<title>Pricing — CraftedPixel | Packages by service line</title>",
    top,
    count=1,
    flags=re.DOTALL,
)
top = re.sub(
    r'<meta name="description" content="[^"]*"\s*/>',
    '<meta name="description" content="CraftedPixel pricing: four packages each for UI/UX, web development, SEO, brand, CMS, and analytics—with comparison tables for scope." />',
    top,
    count=1,
)
top = re.sub(
    r'<link rel="canonical" href="[^"]*"\s*/>',
    '<link rel="canonical" href="https://getcraftedpixel.com/pricing" />',
    top,
    count=1,
)

nav_block = idx_text[body_start:hero_idx]
nav_block = nav_block.replace('href="#hero"', 'href="/"', 1)

hero = """
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
      <p class="page-hero-crumb"><a href="/">Home</a> / Pricing</p>
      <span class="section-label">Pricing</span>
      <h1 id="pricing-hero-title" class="page-hero-title">Packages by service—with a clear scope matrix.</h1>
      <p class="page-hero-lede">Pick a tab to see four tiers and a comparison table underneath. Numbers are starting points until we align scope on a short call.</p>
      <div class="page-hero-aux" style="margin-top:1rem">
        <a href="how-we-work#pricing-expectations">How we price</a>
        · <a href="services">All services</a>
        · <a href="contact">Get a quote</a>
      </div>
    </div>
  </header>

  <main id="main-content">
"""

footer_start = idx_text.index("  <!-- FOOTER -->")
footer_and_scripts = idx_text[footer_start:]

hash_script = """
  <script>
    (function () {
      var h = (location.hash || '').replace(/^#/, '');
      if (!/^(uiux|webdev|seo|brand|cms|analytics)$/.test(h)) return;
      var tab = document.querySelector('.packages-tab[data-tab="' + h + '"]');
      if (tab) { tab.click(); tab.focus(); }
    })();
  </script>
"""
footer_and_scripts = footer_and_scripts.replace("</body>", hash_script + "\n</body>", 1)

out = (
    top
    + nav_block
    + hero
    + pkg
    + "\n  </main>\n\n"
    + footer_and_scripts
)

(root / "pricing.html").write_text(out, encoding="utf-8")
print("Wrote pricing.html")
