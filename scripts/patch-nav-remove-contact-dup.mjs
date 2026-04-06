import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const DESKTOP_LI = /            <li><a href="contact\.html">Contact<\/a><\/li>\r?\n/g;
const MOBILE_A = /    <a href="contact\.html" onclick="closeMobile\(\)">Contact<\/a>\r?\n/g;

for (const f of fs.readdirSync(root)) {
  if (!f.endsWith(".html")) continue;
  const p = path.join(root, f);
  let t = fs.readFileSync(p, "utf8");
  const orig = t;

  t = t.replace(DESKTOP_LI, "");
  t = t.replace(MOBILE_A, "");

  if (f === "contact.html") {
    t = t.replace(
      /            <li><a href="contact\.html" aria-current="page">Contact<\/a><\/li>\r?\n          <\/ul>\r?\n        <\/div>\r?\n        <div class="nav-actions">/,
      "          </ul>\n        </div>\n        <div class=\"nav-actions\">"
    );
    t = t.replace(
      /<a href="contact\.html" class="button button--primary nav-cta">/,
      '<a href="contact.html" class="button button--primary nav-cta" aria-current="page">'
    );
    t = t.replace(
      /<a href="contact\.html" class="button button--primary nav-cta-mobile">/,
      '<a href="contact.html" class="button button--primary nav-cta-mobile" aria-current="page">'
    );
  }

  if (t !== orig) fs.writeFileSync(p, t, "utf8");
}

console.log("nav contact dup patch done");
