"""One-off: Pricing links, Resources dropdown, initNavServicesAria for all site HTML."""
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent

DESKTOP_RESOURCES_RE = re.compile(
    r'            <li><a href="how-we-work\.html">How we work</a></li>\s*\n'
    r'            <li><a href="blog\.html">Blog</a></li>\s*\n'
    r'            <li><a href="careers\.html"([^>]*)>Careers</a></li>'
)

DESKTOP_RESOURCES_NEW = r'''            <li class="nav-dropdown">
              <a href="how-we-work.html" class="nav-dropdown-link" aria-haspopup="true">
                <span class="nav-dropdown-label">Resources</span>
                <span class="nav-dropdown-caret" aria-hidden="true">
                  <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
                </span>
              </a>
              <div class="nav-dropdown-panel-wrap">
                <ul id="navResourcesMenu" class="nav-dropdown-panel" role="list">
                  <li><a href="how-we-work.html">How we work</a></li>
                  <li><a href="blog.html">Blog</a></li>
                  <li><a href="careers.html"\1>Careers</a></li>
                </ul>
              </div>
            </li>'''

MOBILE_OLD = """    <a href="how-we-work.html" onclick="closeMobile()">How we work</a>
    <a href="blog.html" onclick="closeMobile()">Blog</a>
    <a href="careers.html" onclick="closeMobile()">Careers</a>"""

MOBILE_NEW = """    <div class="mobile-nav-group">
      <a href="how-we-work.html" class="mobile-nav-heading mobile-nav-heading--link" onclick="closeMobile()">Resources</a>
      <a href="how-we-work.html" class="mobile-nav-sub" onclick="closeMobile()">How we work</a>
      <a href="blog.html" class="mobile-nav-sub" onclick="closeMobile()">Blog</a>
      <a href="careers.html" class="mobile-nav-sub" onclick="closeMobile()">Careers</a>
    </div>"""

NEW_ARIA_BODY = """(function initNavServicesAria() {
      document.querySelectorAll('.nav-dropdown').forEach(function (wrap) {
        const parentLink = wrap.querySelector('.nav-dropdown-link');
        if (!parentLink) return;
        function syncAriaCurrent() {
          const file = (location.pathname.split('/').pop() || '').split('?')[0];
          parentLink.removeAttribute('aria-current');
          wrap.querySelectorAll('.nav-dropdown-panel a').forEach(function (a) {
            a.removeAttribute('aria-current');
          });
          if (!file) return;
          let matched = null;
          wrap.querySelectorAll('.nav-dropdown-panel a').forEach(function (a) {
            const h = a.getAttribute('href') || '';
            if (!h || h.charAt(0) === '#') return;
            const base = h.split('#')[0].split('/').pop();
            if (base === file) matched = a;
          });
          if (matched) {
            matched.setAttribute('aria-current', 'page');
            return;
          }
          const p = (parentLink.getAttribute('href') || '').split('#')[0].split('/').pop();
          if (p && p === file) parentLink.setAttribute('aria-current', 'page');
        }
        syncAriaCurrent();
      });
    })();"""

OLD_ARIA_RE = re.compile(r"(\s*)\(function initNavServicesAria\(\) \{[\s\S]*?\}\)\(\);")


def replace_aria(text: str) -> str:
    if "querySelectorAll('.nav-dropdown')" in text:
        return text
    return OLD_ARIA_RE.sub(lambda m: m.group(1) + NEW_ARIA_BODY, text, count=1)


def patch_text(name: str, text: str) -> str:
    if "navResourcesMenu" in text and "pricing.html" in text and "initNavServicesAria" in text:
        # Heuristic skip if already fully patched (re-run safe for aria only)
        pass

    text = text.replace("index.html#packages", "pricing.html")
    text = text.replace('<li><a href="#packages">Pricing</a></li>', '<li><a href="pricing.html">Pricing</a></li>')
    text = text.replace(
        '<a href="#packages" onclick="closeMobile()">Pricing</a>',
        '<a href="pricing.html" onclick="closeMobile()">Pricing</a>',
    )
    text = text.replace('<li><a href="#packages">Pricing</a></li>', '<li><a href="pricing.html">Pricing</a></li>')
    text = text.replace('href="#packages"', 'href="pricing.html"')

    if "navResourcesMenu" not in text:
        text, n = DESKTOP_RESOURCES_RE.subn(DESKTOP_RESOURCES_NEW, text, count=1)
        if n != 1:
            print("  WARN: desktop Resources replace count", n, name)
        if MOBILE_OLD in text:
            text = text.replace(MOBILE_OLD, MOBILE_NEW, 1)
        else:
            print("  WARN: mobile Resources block not found", name)

    if name == "pricing.html":
        text = text.replace(
            '<li><a href="pricing.html">Pricing</a></li>',
            '<li><a href="pricing.html" aria-current="page">Pricing</a></li>',
            1,
        )

    text = replace_aria(text)

    return text


def main():
    for path in sorted(root.glob("*.html")):
        text = path.read_text(encoding="utf-8")
        orig = text
        text = patch_text(path.name, text)
        if "initNavServicesAria" in text and "querySelectorAll('.nav-dropdown')" not in text:
            print("  WARN: initNavServicesAria not upgraded", path.name)
        if text != orig:
            path.write_text(text, encoding="utf-8")
            print("Patched", path.name)


if __name__ == "__main__":
    main()
