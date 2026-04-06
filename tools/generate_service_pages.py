# -*- coding: utf-8 -*-
"""Generate service-*.html from service-ui-ux.html shell (nav + script) and per-page content."""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

from service_pages_more import MORE_PAGES

ROOT = Path(__file__).resolve().parent.parent
SRC = (ROOT / "service-ui-ux.html").read_text(encoding="utf-8")

# Must match service detail pages: class is "page-hero has-geo", not "page-hero" alone.
_HEADER_MARKER = '  <header class="page-hero has-geo"'
PREFIX = SRC.split(_HEADER_MARKER, 1)[0]
_TAIL_SPLIT = SRC.split("</main>", 1)
TAIL = _TAIL_SPLIT[1] if len(_TAIL_SPLIT) > 1 else ""


def esc_json_ld(obj: dict) -> str:
    return json.dumps(obj, ensure_ascii=False, indent=2)


def full_head(
    title: str,
    meta_desc: str,
    filename: str,
    og_title: str,
    service_name: str,
) -> str:
    url = f"https://craftedpixel.com/{filename}"
    plain_name = html.unescape(title).split("—")[0].strip()
    desc_plain = html.unescape(meta_desc)
    svc_plain = html.unescape(service_name)
    ld = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": f"{url}#webpage",
                "url": url,
                "name": plain_name,
                "description": desc_plain,
                "inLanguage": "en-US",
                "isPartOf": {"@type": "WebSite", "name": "CraftedPixel", "url": "https://craftedpixel.com/"},
            },
            {
                "@type": "Service",
                "@id": f"{url}#service",
                "name": svc_plain,
                "description": desc_plain,
                "provider": {"@type": "Organization", "name": "CraftedPixel", "url": "https://craftedpixel.com/"},
                "areaServed": "US",
                "serviceType": svc_plain,
            },
        ],
    }
    return f"""  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>{title}</title>
  <meta name="description" content="{meta_desc}" />
  <link rel="canonical" href="{url}" />
  <meta property="og:title" content="{og_title}" />
  <meta property="og:description" content="{meta_desc}" />
  <meta property="og:url" content="{url}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{og_title}" />
  <meta name="twitter:description" content="{meta_desc}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
  <link rel="stylesheet" href="css/main.css" />
  <script type="application/ld+json">
{esc_json_ld(ld)}
  </script>"""


def splice_head(prefix: str, head_inner: str) -> str:
    before, rest = prefix.split("<head>", 1)
    _, after = rest.split("</head>", 1)
    return f"{before}<head>\n{head_inner}\n</head>{after}"


def footer_services_ul(current_file: str) -> str:
    links = [
        ("service-ui-ux.html", "UI/UX Design"),
        ("service-web-development.html", "Web Development"),
        ("service-seo-growth.html", "SEO &amp; Growth"),
        ("service-brand-design-systems.html", "Brand &amp; systems"),
        ("service-content-cms.html", "Content &amp; CMS"),
        ("service-analytics-experimentation.html", "Analytics"),
    ]
    lis = []
    for href, label in links:
        ac = ' aria-current="page"' if href == current_file else ""
        lis.append(f'            <li><a href="{href}"{ac}>{label}</a></li>')
    lis.append('            <li><a href="pricing.html">Pricing</a></li>')
    return "<ul class=\"footer-links\">\n" + "\n".join(lis) + "\n          </ul>"


def patch_footer(tail: str, current_file: str) -> str:
    def repl(m: re.Match[str]) -> str:
        return m.group(1) + footer_services_ul(current_file)

    return re.sub(
        r'(<h5>Services</h5>\s*)<ul class="footer-links">.*?</ul>',
        repl,
        tail,
        count=1,
        flags=re.DOTALL,
    )


def hero(
    crumb_last: str,
    h1: str,
    lede: str,
    m1: tuple[str, str],
    m2: tuple[str, str],
    m3: tuple[str, str],
) -> str:
    return f"""  <header class="page-hero has-geo" aria-labelledby="service-hero-title">
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
      <p class="page-hero-crumb"><a href="index.html">Home</a> / <a href="services.html">Services</a> / {crumb_last}</p>
      <span class="section-label">Service</span>
      <h1 id="service-hero-title" class="page-hero-title page-hero-title--wide">{h1}</h1>
      <p class="page-hero-lede">{lede}</p>
      <div class="page-hero-meta" aria-label="At a glance">
        <div class="page-hero-meta-item">
          <span class="page-hero-meta-label">{m1[0]}</span>
          <span class="page-hero-meta-value">{m1[1]}</span>
        </div>
        <div class="page-hero-meta-item">
          <span class="page-hero-meta-label">{m2[0]}</span>
          <span class="page-hero-meta-value">{m2[1]}</span>
        </div>
        <div class="page-hero-meta-item">
          <span class="page-hero-meta-label">{m3[0]}</span>
          <span class="page-hero-meta-value">{m3[1]}</span>
        </div>
      </div>
    </div>
  </header>
"""


def jump_nav(links: list[tuple[str, str]]) -> str:
    inner = "\n      ".join(f'<a href="{h}">{lab}</a>' for h, lab in links)
    return f"""  <nav class="service-detail-jump" aria-label="On this page">
    <div class="container service-detail-jump-inner">
      {inner}
    </div>
  </nav>
"""


def intro_block(heading: str, lede: str, pills: list[tuple[str, str]]) -> str:
    lis = []
    for icon, text in pills:
        lis.append(
            f'            <li><i class="fa-solid {icon}" aria-hidden="true"></i> <span>{text}</span></li>'
        )
    return f"""    <section class="service-detail-intro" aria-labelledby="intro-heading">
      <div class="container">
        <div class="service-detail-intro-grid">
          <div>
            <h2 id="intro-heading">{heading}</h2>
            <p class="service-detail-intro-lede">{lede}</p>
          </div>
          <ul class="service-detail-pills">
{chr(10).join(lis)}
          </ul>
        </div>
      </div>
    </section>
"""


def flow_block(flow_heading: str, flow_lede: str, steps: list[tuple[str, str, str]], strip: list[str]) -> str:
    parts: list[str] = []
    for i, (icon, title, cap) in enumerate(steps):
        parts.append(f"""          <div class="service-detail-flow-step" role="listitem">
            <span class="service-detail-flow-step-icon" aria-hidden="true"><i class="fa-solid {icon}"></i></span>
            <span class="service-detail-flow-step-title">{title}</span>
            <span class="service-detail-flow-step-cap">{cap}</span>
          </div>""")
        if i < len(steps) - 1:
            parts.append('          <span class="service-detail-flow-arrow" aria-hidden="true"><i class="fa-solid fa-arrow-right"></i></span>')
    strip_inner = []
    for j, lab in enumerate(strip):
        strip_inner.append(f'            <span class="service-detail-flow-strip-label">{lab}</span>')
        if j < len(strip) - 1:
            strip_inner.append('            <span class="service-detail-flow-strip-dot"></span>')
    return f"""    <section class="service-detail-flow has-geo tex-dots" id="process-flow" aria-labelledby="flow-heading">
      <div class="geo geo-circle c-blue geo-f2" style="width:36px;height:36px;top:18%;left:5%;opacity:0.08"></div>
      <div class="geo geo-square c-teal geo-f1" style="width:20px;height:20px;bottom:20%;right:8%;opacity:0.07"></div>
      <div class="container">
        <header class="service-detail-flow-header">
          <span class="section-label">End-to-end</span>
          <h2 id="flow-heading">{flow_heading}</h2>
          <p class="service-detail-flow-lede">{flow_lede}</p>
        </header>
        <div class="service-detail-flow-track" role="list">
{chr(10).join(parts)}
        </div>
        <div class="service-detail-flow-strip" aria-hidden="true">
          <div class="service-detail-flow-strip-inner">
{chr(10).join(strip_inner)}
          </div>
        </div>
      </div>
    </section>
"""


def section_block(
    sec_id: str,
    num: str,
    title: str,
    aria_id: str,
    tagline: str,
    p1: str,
    p2: str,
    outputs: list[str],
    note: str,
    alt: bool,
    geo: str,
) -> str:
    cls = "service-detail-section service-detail-section--alt has-geo tex-dots" if alt else "service-detail-section has-geo tex-dots"
    outs = "\n".join(
        f'              <li><i class="fa-solid fa-check" aria-hidden="true"></i> {o}</li>' for o in outputs
    )
    return f"""    <section class="{cls}" id="{sec_id}" aria-labelledby="{aria_id}">
      {geo}
      <div class="container">
        <header class="service-detail-section-header">
          <span class="service-detail-num">{num}</span>
          <h2 id="{aria_id}">{title}</h2>
          <p class="service-detail-tagline">{tagline}</p>
        </header>
        <div class="service-detail-body">
          <div class="service-detail-col service-detail-col--copy">
            <p>{p1}</p>
            <p>{p2}</p>
          </div>
          <aside class="service-detail-col service-detail-col--aside" aria-label="Deliverables">
            <h3 class="service-detail-aside-title">Typical outputs</h3>
            <ul class="service-detail-checks">
{outs}
            </ul>
            <h3 class="service-detail-aside-title">Best when</h3>
            <p class="service-detail-aside-note">{note}</p>
          </aside>
        </div>
      </div>
    </section>
"""


def quote_block(q: str, name: str, role: str) -> str:
    return f"""    <section class="service-detail-quote has-geo tex-dots" aria-labelledby="quote-eyebrow">
      <div class="geo geo-diamond c-violet geo-f2" style="width:18px;height:18px;top:30%;right:6%;opacity:0.06"></div>
      <div class="container">
        <span class="section-label" id="quote-eyebrow">Client voice</span>
        <blockquote class="service-detail-quote-block">
          <p>&ldquo;{q}&rdquo;</p>
          <footer class="service-detail-quote-meta">
            <span class="service-detail-quote-name">{name}</span>
            <span class="service-detail-quote-role">{role}</span>
          </footer>
        </blockquote>
      </div>
    </section>
"""


def future_block(cards: list[tuple[str, str, str]]) -> str:
    items = []
    for badge, h3, p in cards:
        bcls = "service-future-badge service-future-badge--soon" if badge == "Coming soon" else "service-future-badge"
        items.append(f"""          <article class="service-future-card">
            <span class="{bcls}">{badge}</span>
            <h3>{h3}</h3>
            <p>{p}</p>
          </article>""")
    return f"""    <section class="service-detail-future has-geo" id="future" aria-labelledby="future-heading">
      <div class="geo geo-ring c-teal geo-spin" style="width:64px;height:64px;top:10%;right:8%;opacity:0.07"></div>
      <div class="container">
        <span class="service-detail-future-eyebrow">Roadmap</span>
        <h2 id="future-heading">On the horizon</h2>
        <p class="service-detail-future-lede">We invest where client roadmaps are heading—piloted carefully, not slideware.</p>
        <div class="service-future-grid">
{chr(10).join(items)}
        </div>
      </div>
    </section>
"""


def related_block(lede: str, cards: list[dict]) -> str:
    parts = []
    for c in cards:
        parts.append(f"""          <a href="{c["href"]}" class="service-detail-related-card">
            <div class="service-detail-related-visual">
              <img src="{c["img"]}" alt="" width="800" height="500" loading="lazy" decoding="async" />
            </div>
            <div class="service-detail-related-body">
              <span class="service-detail-related-eyebrow">Case study</span>
              <h3 class="service-detail-related-title">{c["title"]}</h3>
              <p class="service-detail-related-desc">{c["desc"]}</p>
              <span class="service-detail-related-cta">View on homepage <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></span>
            </div>
          </a>""")
    return f"""    <section class="service-detail-related has-geo tex-dots" id="related-work" aria-labelledby="related-heading">
      <div class="geo geo-ring c-navy geo-spin" style="width:48px;height:48px;top:12%;left:4%;opacity:0.05"></div>
      <div class="container">
        <header class="service-detail-related-header">
          <span class="section-label">Proof</span>
          <h2 id="related-heading">Related work</h2>
          <p class="service-detail-related-lede">{lede}</p>
        </header>
        <div class="service-detail-related-grid">
{chr(10).join(parts)}
        </div>
      </div>
    </section>
"""


def cadence_block(w1: list[str], w2: list[str], need: list[str], lede: str) -> str:
    def ul(xs: list[str]) -> str:
        return "\n".join(f"              <li>{x}</li>" for x in xs)

    return f"""    <section class="service-detail-cadence service-detail-section--alt has-geo tex-dots" id="cadence" aria-labelledby="cadence-heading">
      <div class="container">
        <header class="service-detail-cadence-header">
          <span class="section-label">Cadence</span>
          <h2 id="cadence-heading">What a typical two weeks looks like</h2>
          <p class="service-detail-cadence-lede">{lede}</p>
        </header>
        <div class="service-detail-cadence-grid">
          <article class="service-detail-cadence-card">
            <h3 class="service-detail-cadence-card-title"><i class="fa-solid fa-calendar-week" aria-hidden="true"></i> Week 1</h3>
            <ul class="service-detail-cadence-list">
{ul(w1)}
            </ul>
          </article>
          <article class="service-detail-cadence-card">
            <h3 class="service-detail-cadence-card-title"><i class="fa-solid fa-calendar-check" aria-hidden="true"></i> Week 2</h3>
            <ul class="service-detail-cadence-list">
{ul(w2)}
            </ul>
          </article>
          <article class="service-detail-cadence-card service-detail-cadence-card--wide">
            <h3 class="service-detail-cadence-card-title"><i class="fa-solid fa-handshake" aria-hidden="true"></i> What we need from you</h3>
            <ul class="service-detail-cadence-list service-detail-cadence-list--cols">
{ul(need)}
            </ul>
          </article>
        </div>
      </div>
    </section>
"""


def fit_block(p: str, links: list[tuple[str, str]]) -> str:
    lis = "\n".join(
        f'              <li><a href="{href}">{text}</a></li>' for href, text in links
    )
    return f"""    <section class="service-detail-fit" id="good-fit" aria-labelledby="fit-heading">
      <div class="container">
        <div class="service-detail-fit-panel">
          <div class="service-detail-fit-icon" aria-hidden="true"><i class="fa-solid fa-signs-post"></i></div>
          <div class="service-detail-fit-copy">
            <h2 id="fit-heading">You might start elsewhere</h2>
            <p>{p}</p>
            <ul class="service-detail-fit-links">
{lis}
            </ul>
          </div>
        </div>
      </div>
    </section>
"""


def faq_block(topic: str, intro: str, items: list[tuple[str, str]]) -> str:
    faq_items = []
    for q, a in items:
        faq_items.append(f"""            <div class="faq-item">
              <button type="button" class="faq-q" aria-expanded="false" onclick="toggleFaq(this)">{q}<span class="faq-icon" aria-hidden="true"><i class="fa-solid fa-plus"></i></span></button>
              <div class="faq-a"><div class="faq-a-inner">{a}</div></div>
            </div>""")
    return f"""    <section class="service-detail-faq has-geo tex-dots" id="service-faq" aria-labelledby="sfaq-heading">
      <div class="container">
        <div class="service-detail-faq-grid">
          <div class="service-detail-faq-intro">
            <span class="section-label">FAQ</span>
            <h2 id="sfaq-heading">{topic}</h2>
            <p class="service-detail-faq-intro-text">{intro}</p>
            <a href="index.html#contact" class="button button--primary service-detail-faq-cta">
              <span>Ask a specific question</span>
              <span class="button__icon-wrapper" aria-hidden="true">
                <i class="fa-solid fa-paper-plane button__icon-svg"></i>
                <i class="fa-solid fa-paper-plane button__icon-svg button__icon-svg--copy"></i>
              </span>
            </a>
          </div>
          <div class="faq-list">
{chr(10).join(faq_items)}
          </div>
        </div>
      </div>
    </section>
"""


def cta_block(p: str, back_href: str, back_label: str) -> str:
    return f"""    <section class="service-detail-cta" aria-labelledby="cta-heading">
      <div class="container">
        <div class="service-detail-cta-panel">
          <h2 id="cta-heading">Tell us what you&rsquo;re shipping</h2>
          <p>{p}</p>
          <div class="service-detail-cta-row">
            <a href="index.html#contact" class="button button--primary">
              <span>Start a conversation</span>
              <span class="button__icon-wrapper" aria-hidden="true">
                <i class="fa-solid fa-paper-plane button__icon-svg"></i>
                <i class="fa-solid fa-paper-plane button__icon-svg button__icon-svg--copy"></i>
              </span>
            </a>
            <a href="{back_href}" class="button button--outline-dark">
              <span>{back_label}</span>
              <span class="button__icon-wrapper" aria-hidden="true">
                <i class="fa-solid fa-arrow-left button__icon-svg"></i>
                <i class="fa-solid fa-arrow-left button__icon-svg button__icon-svg--copy"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
"""


IMG_KOVA = "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&amp;fit=crop&amp;w=800&amp;h=500&amp;q=80"
IMG_LUMA = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&amp;fit=crop&amp;w=800&amp;h=500&amp;q=80"
IMG_MERO = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&amp;fit=crop&amp;w=800&amp;h=500&amp;q=80"

GEOS = [
    '<div class="geo geo-circle c-navy geo-f1" style="width:40px;height:40px;top:12%;right:4%"></div>',
    '<div class="geo geo-ring c-blue geo-spin" style="width:50px;height:50px;bottom:14%;left:5%"></div>',
    '<div class="geo geo-square c-teal geo-f2" style="width:28px;height:28px;top:18%;right:6%"></div>',
    '<div class="geo geo-diamond c-violet geo-f1" style="width:20px;height:20px;top:22%;left:8%"></div>',
    '<div class="geo geo-circle c-blue geo-f2" style="width:32px;height:32px;bottom:12%;right:5%"></div>',
]


def build_page(cfg: dict) -> str:
    h_inner = full_head(
        cfg["title"],
        cfg["meta_desc"],
        cfg["file"],
        cfg["og_title"],
        cfg["service_name"],
    )
    prefix = splice_head(PREFIX, h_inner)
    parts_main = [
        hero(
            cfg["crumb_last"],
            cfg["h1"],
            cfg["lede"],
            cfg["meta_row"][0],
            cfg["meta_row"][1],
            cfg["meta_row"][2],
        ),
        jump_nav(cfg["jump"]),
        "<main>",
        intro_block(cfg["intro_h"], cfg["intro_lede"], cfg["pills"]),
        flow_block(cfg["flow_h"], cfg["flow_lede"], cfg["flow_steps"], cfg["flow_strip"]),
    ]
    for i, s in enumerate(cfg["sections"]):
        parts_main.append(
            section_block(
                s["id"],
                s["num"],
                s["title"],
                s["aria"],
                s["tag"],
                s["p1"],
                s["p2"],
                s["outs"],
                s["note"],
                alt=bool(i % 2),
                geo=GEOS[i % len(GEOS)],
            )
        )
    parts_main.extend(
        [
            quote_block(cfg["quote"][0], cfg["quote"][1], cfg["quote"][2]),
            future_block(cfg["future_cards"]),
            related_block(cfg["related_lede"], cfg["related_cards"]),
            cadence_block(cfg["cadence_w1"], cfg["cadence_w2"], cfg["cadence_need"], cfg["cadence_lede"]),
            fit_block(cfg["fit_p"], cfg["fit_links"]),
            faq_block(cfg["faq_topic"], cfg["faq_intro"], cfg["faq_items"]),
            cta_block(cfg["cta_p"], cfg["back_href"], cfg["back_label"]),
            "</main>",
        ]
    )
    tail = patch_footer(TAIL, cfg["file"])
    return prefix + "\n" + "\n".join(parts_main) + tail


WEB_DEV: dict = {
        "file": "service-web-development.html",
        "service_name": "Web Development",
        "title": "Web Development Services — CraftedPixel | React, Next.js, Full-Stack &amp; Launch",
        "og_title": "Web Development Agency Services | CraftedPixel",
        "meta_desc": "Production web development: React &amp; Next.js frontends, full-stack APIs, Core Web Vitals performance, WordPress &amp; hybrid builds, and CI/CD launch hardening. CraftedPixel — New York, Novi Sad, worldwide.",
        "crumb_last": "Web development",
        "h1": "Web Development",
        "lede": "Ship reliable frontends and APIs—tested, observable, and fast enough to pass real Core Web Vitals budgets, not just localhost demos.",
        "meta_row": [
            ("Engagements", "3–16 week builds"),
            ("Stack", "React · Next.js · Node · WP"),
            ("Output", "Repo + CI + docs"),
        ],
        "jump": [
            ("#process-flow", "Process"),
            ("#frontend", "Frontend"),
            ("#fullstack", "Full-stack"),
            ("#performance", "Performance"),
            ("#wordpress", "WordPress"),
            ("#launch", "Launch"),
            ("#future", "Future"),
            ("#related-work", "Work"),
            ("#service-faq", "FAQ"),
        ],
        "intro_h": "How we plug in",
        "intro_lede": "We embed with your product and infra constraints—types, lint rules, and deployment targets you already use. You get incremental PRs, preview URLs, and runbooks instead of a black-box drop.",
        "pills": [
            ("fa-code", "<strong>Greenfield build</strong> — new app or marketing site from architecture to production."),
            ("fa-screwdriver-wrench", "<strong>Rescue &amp; refactor</strong> — stabilize legacy code, add tests, and unblock your roadmap."),
            ("fa-rocket", "<strong>Launch partner</strong> — harden CI/CD, cutover, and post-launch monitoring for high-stakes releases."),
        ],
        "flow_h": "From spec to stable release",
        "flow_lede": "Each phase produces something runnable—so scope, risk, and ownership stay visible to both sides.",
        "flow_steps": [
            ("fa-file-lines", "Spec", "APIs &amp; UI contract"),
            ("fa-laptop-code", "Build", "Components &amp; routes"),
            ("fa-gauge-high", "Perf", "CWV &amp; budgets"),
            ("fa-wordpress", "CMS edge", "Content hooks"),
            ("fa-ship", "Launch", "CI &amp; cutover"),
        ],
        "flow_strip": ["TypeScript", "Tests", "Preview", "Staging", "Prod"],
        "sections": [
            {
                "id": "frontend",
                "num": "01",
                "title": "Frontend engineering",
                "aria": "sd-fe-title",
                "tag": "Accessible, performant UIs in React or Next.js—wired to your design tokens and component naming so design and code stay aligned.",
                "p1": "We structure routes, data loading, and component boundaries for maintainability: server components where they help, client islands where they must, and consistent error/empty/loading states across the tree.",
                "p2": "Styling follows your system—CSS modules, Tailwind, or styled patterns—with focus states, reduced-motion respect, and keyboard paths that match the design spec.",
                "outs": [
                    "Production-ready component tree &amp; routes",
                    "Storybook or equivalent where agreed",
                    "Accessibility pass on critical flows",
                    "Handoff notes for your eng team",
                ],
                "note": "You have UI locked and need implementation velocity without sacrificing quality or a11y.",
            },
            {
                "id": "fullstack",
                "num": "02",
                "title": "Full-stack &amp; APIs",
                "aria": "sd-fs-title",
                "tag": "REST or GraphQL services with clear auth boundaries, validation, and observability—so your mobile and web clients share one honest contract.",
                "p1": "We model endpoints around use cases, not accidental database shapes. Migrations, idempotency for webhooks, and rate limits are considered up front—not patched after an incident.",
                "p2": "When you already run Node, we meet your runtime. When you don&rsquo;t, we document integration points so another team can own the service long-term.",
                "outs": [
                    "OpenAPI / schema docs where applicable",
                    "Auth integration (OAuth, sessions, API keys)",
                    "Background jobs &amp; retry strategy",
                    "Logging &amp; error taxonomy",
                ],
                "note": "Frontend is underway but the data layer, integrations, or auth is the bottleneck.",
            },
            {
                "id": "performance",
                "num": "03",
                "title": "Performance engineering",
                "aria": "sd-perf-title",
                "tag": "Core Web Vitals, bundle discipline, caching, and image/video strategy—measured in field data, not Lighthouse vanity scores alone.",
                "p1": "We profile the critical path, split bundles intelligently, and align CDN and cache headers with how your HTML and assets actually change.",
                "p2": "Third-party scripts get budgets and load strategies so marketing tags don&rsquo;t silently erase your LCP wins.",
                "outs": [
                    "Before/after Web Vitals report",
                    "Bundle &amp; dependency recommendations",
                    "CDN / cache header checklist",
                    "Regression budget for new scripts",
                ],
                "note": "Organic traffic or paid landing pages stall because speed became a conversion problem.",
            },
            {
                "id": "wordpress",
                "num": "04",
                "title": "WordPress &amp; hybrid builds",
                "aria": "sd-wp-title",
                "tag": "Block themes, headless WordPress, or classic stacks—chosen for your editorial workflow and frontend requirements, not our favorite boilerplate.",
                "p1": "We map content types to real editor mental models, constrain the block library to what you need, and avoid plugin sprawl that breaks on every PHP update.",
                "p2": "Headless setups get preview URLs, webhook-driven revalidation, and fallbacks so editors never feel blind.",
                "outs": [
                    "Theme or headless integration plan",
                    "Custom blocks / patterns as scoped",
                    "Migration notes from legacy content",
                    "Editor training cheat sheet",
                ],
                "note": "Marketing owns publishing cadence and needs WordPress (or hybrid) without sacrificing modern frontend UX.",
            },
            {
                "id": "launch",
                "num": "05",
                "title": "Launch, CI/CD &amp; hardening",
                "aria": "sd-launch-title",
                "tag": "Pipelines, environments, secrets hygiene, and go-live checklists—fewer 2 a.m. surprises when DNS flips.",
                "p1": "We wire preview deployments to branches, gate production merges with checks you trust, and document rollback paths before traffic arrives.",
                "p2": "Post-launch we watch error rates and performance budgets alongside you for an agreed window—then hand off dashboards and ownership.",
                "outs": [
                    "CI workflow &amp; env matrix",
                    "Release &amp; rollback runbook",
                    "Smoke test list for cutover",
                    "Post-launch monitoring handoff",
                ],
                "note": "You are days from launch or replatforming and need disciplined cutover—not heroic manual deploys.",
            },
        ],
        "quote": (
            "Their PRs were small, reviewable, and always included how to verify the change—our staging finally matched prod behavior.",
            "Alex R.",
            "Engineering Lead, B2B SaaS",
        ),
        "future_cards": [
            ("Piloting", "Edge rendering playbooks", "Framework-specific patterns for partial static generation and ISR without cache poisoning surprises."),
            ("Exploring", "Contract testing in CI", "Consumer-driven contracts between web apps and APIs to catch breaking changes early."),
            ("Coming soon", "SRE-lite retainers", "Short monthly windows for dependency upgrades, security patches, and perf regressions."),
            ("Exploring", "Platform adapters", "Thin abstraction layers when you must support Shopify, Contentful, and custom CMS edges in one frontend."),
        ],
        "related_lede": "Case studies with full-stack delivery, metrics, and stack context—deep-linked from the homepage.",
        "related_cards": [
            {
                "href": "index.html#case-kova",
                "img": IMG_KOVA,
                "title": "Kova — hiring platform",
                "desc": "React + TypeScript product UI with measurable recruiter outcomes.",
            },
            {
                "href": "index.html#case-mero",
                "img": IMG_MERO,
                "title": "Mero — expense app",
                "desc": "Design-through-ship in <strong>11 weeks</strong>; full-stack Node delivery.",
            },
        ],
        "cadence_lede": "Typical mid-build rhythm—tuned to your sprint length and review culture.",
        "cadence_w1": [
            "Repo access, environments, and definition of done",
            "Spike or scaffold for riskiest integration",
            "First vertical slice behind a feature flag",
        ],
        "cadence_w2": [
            "PR reviews with test evidence &amp; preview link",
            "Perf or a11y checkpoint on agreed routes",
            "Cut plan for next milestone + tech debt note",
        ],
        "cadence_need": [
            "Design files or component spec for UI scope",
            "Staging data or sanitized exports for realistic QA",
            "One DRI for merges and release windows",
            "Secrets &amp; DNS access per your security policy",
        ],
        "fit_p": "If UX discovery or brand narrative is still unsettled, starting with UI/UX or brand systems often saves expensive rework in code.",
        "fit_links": [
            ("service-ui-ux.html", "UI/UX — flows, UI, and research before build volume"),
            ("service-seo-growth.html", "SEO &amp; growth — when organic traffic is the primary constraint"),
            ("services.html#analytics-experimentation", "Analytics — measurement before you optimize in production"),
        ],
        "faq_topic": "Web development engagements",
        "faq_intro": "Scope, stack fit, and how we collaborate with your team before day one.",
        "faq_items": [
            (
                "Do we have to use React or Next.js?",
                "No. We list React/Next.js because that&rsquo;s where most of our recent production work lives—but we&rsquo;ll match your existing stack when it&rsquo;s the right tradeoff. Tell us what you run today and what &ldquo;done&rdquo; means.",
            ),
            (
                "How do you handle legacy codebases?",
                "We start with a short read-only audit: tests (if any), deploy path, and top risks. Then we propose a sequence of small merges—each leaving the repo healthier—rather than a risky big-bang rewrite.",
            ),
            (
                "Who owns hosting and domains?",
                "You retain ownership. We work in your accounts or a shared project with documented handoff. We don&rsquo;t hold domains hostage.",
            ),
            (
                "Can you work with our design system?",
                "Yes. We consume Figma specs, Storybook, or coded components and extend them with PRs your team can review. If the system is thin, we help harden tokens and states as we build.",
            ),
            (
                "What about SLAs after launch?",
                "Every build includes an agreed stabilization window. After that, we can hand off to your team, stay on a light retainer, or document runbooks—your call.",
            ),
        ],
        "cta_p": "Whether you need a focused performance pass or a multi-month build, we&rsquo;ll propose the smallest scope that still de-risks launch.",
        "back_href": "services.html#web-development",
        "back_label": "Web dev offerings list",
    }

PAGES: list[dict] = [WEB_DEV] + MORE_PAGES


def patch_service_ui_ux_head() -> None:
    path = ROOT / "service-ui-ux.html"
    raw = path.read_text(encoding="utf-8")
    pre, rest = raw.split(_HEADER_MARKER, 1)
    main_body, tail = rest.split("</main>", 1)
    inner = full_head(
        "UI/UX Design — CraftedPixel | Product Design, Research &amp; Handoff",
        "CraftedPixel UI/UX design services: product strategy, prototyping, visual UI, user research, and developer handoff. Clear deliverables for B2B and consumer teams.",
        "service-ui-ux.html",
        "UI/UX Design Services | CraftedPixel",
        "UI/UX Design",
    )
    new_doc = splice_head(pre, inner) + _HEADER_MARKER + main_body + "</main>" + patch_footer(tail, "service-ui-ux.html")
    path.write_text(new_doc, encoding="utf-8")


def main() -> None:
    for cfg in PAGES:
        out = ROOT / cfg["file"]
        out.write_text(build_page(cfg), encoding="utf-8")
        print("Wrote", out.name)
    patch_service_ui_ux_head()
    print("Patched service-ui-ux.html head, footer, JSON-LD")


if __name__ == "__main__":
    main()
