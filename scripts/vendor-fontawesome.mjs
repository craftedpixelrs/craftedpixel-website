/**
 * One-shot: download Font Awesome 6.5.1 webfonts + build css/fontawesome.min.css (local paths, font-display: swap).
 * Run from repo root: node scripts/vendor-fontawesome.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const base = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1";
const webfontsDir = path.join(root, "assets", "vendor", "font-awesome", "webfonts");

const fonts = [
  "fa-solid-900.woff2",
  "fa-regular-400.woff2",
  "fa-brands-400.woff2",
  "fa-v4compatibility.woff2",
];

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          get(res.headers.location).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`${url} → ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

async function main() {
  fs.mkdirSync(webfontsDir, { recursive: true });
  for (const f of fonts) {
    const buf = await get(`${base}/webfonts/${f}`);
    fs.writeFileSync(path.join(webfontsDir, f), buf);
    console.log("wrote", f, buf.length);
  }
  let css = (await get(`${base}/css/all.min.css`)).toString("utf8");
  css = css.replaceAll("url(../webfonts/", "url(../assets/vendor/font-awesome/webfonts/");
  css = css.replaceAll("font-display:block", "font-display:swap");
  css = css.replace(/,url\([^)]+\.ttf\) format\("truetype"\)/g, "");
  const outCss = path.join(root, "css", "fontawesome.min.css");
  fs.writeFileSync(outCss, css, "utf8");
  console.log("wrote css/fontawesome.min.css", css.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
