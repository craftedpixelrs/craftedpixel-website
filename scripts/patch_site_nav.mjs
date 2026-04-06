import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const DESKTOP_RESOURCES_RE =
  /            <li><a href="how-we-work\.html">How we work<\/a><\/li>\s*\n            <li><a href="blog\.html">Blog<\/a><\/li>\s*\n            <li><a href="careers\.html"([^>]*)>Careers<\/a><\/li>/;

const DESKTOP_RESOURCES_NEW = `            <li class="nav-dropdown">
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
                  <li><a href="careers.html"$1>Careers</a></li>
                </ul>
              </div>
            </li>`;

const MOBILE_OLD = `    <a href="how-we-work.html" onclick="closeMobile()">How we work</a>
    <a href="blog.html" onclick="closeMobile()">Blog</a>
    <a href="careers.html" onclick="closeMobile()">Careers</a>`;

const MOBILE_NEW = `    <div class="mobile-nav-group">
      <a href="how-we-work.html" class="mobile-nav-heading mobile-nav-heading--link" onclick="closeMobile()">Resources</a>
      <a href="how-we-work.html" class="mobile-nav-sub" onclick="closeMobile()">How we work</a>
      <a href="blog.html" class="mobile-nav-sub" onclick="closeMobile()">Blog</a>
      <a href="careers.html" class="mobile-nav-sub" onclick="closeMobile()">Careers</a>
    </div>`;

const NEW_ARIA_BODY = `(function initNavServicesAria() {
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
    })();`;

const OLD_ARIA_RE = /(\s*)\(function initNavServicesAria\(\) \{[\s\S]*?\}\)\(\);/;

function replaceAria(text) {
  if (text.includes("querySelectorAll('.nav-dropdown')")) return text;
  return text.replace(OLD_ARIA_RE, (_, indent) => indent + NEW_ARIA_BODY);
}

function patchText(name, text) {
  text = text.replaceAll("index.html#packages", "pricing.html");
  text = text.replaceAll('<li><a href="#packages">Pricing</a></li>', '<li><a href="pricing.html">Pricing</a></li>');
  text = text.replaceAll(
    '<a href="#packages" onclick="closeMobile()">Pricing</a>',
    '<a href="pricing.html" onclick="closeMobile()">Pricing</a>'
  );
  text = text.replaceAll('href="#packages"', 'href="pricing.html"');

  if (!text.includes("navResourcesMenu")) {
    const hadDesktop = DESKTOP_RESOURCES_RE.test(text);
    DESKTOP_RESOURCES_RE.lastIndex = 0;
    text = text.replace(DESKTOP_RESOURCES_RE, DESKTOP_RESOURCES_NEW);
    if (!hadDesktop) console.warn("  WARN: desktop Resources pattern not found", name);
    if (text.includes(MOBILE_OLD)) text = text.replace(MOBILE_OLD, MOBILE_NEW);
    else console.warn("  WARN: mobile Resources block not found", name);
  }

  if (name === "pricing.html") {
    text = text.replace(
      '<li><a href="pricing.html">Pricing</a></li>',
      '<li><a href="pricing.html" aria-current="page">Pricing</a></li>',
      1
    );
  }

  text = replaceAria(text);
  return text;
}

const files = fs.readdirSync(root).filter((f) => f.endsWith(".html"));
for (const f of files.sort()) {
  const p = path.join(root, f);
  let text = fs.readFileSync(p, "utf8");
  const orig = text;
  text = patchText(f, text);
  if (text.includes("initNavServicesAria") && !text.includes("querySelectorAll('.nav-dropdown')")) {
    console.warn("  WARN: initNavServicesAria not upgraded", f);
  }
  if (text !== orig) {
    fs.writeFileSync(p, text, "utf8");
    console.log("Patched", f);
  }
}
