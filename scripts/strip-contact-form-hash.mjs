import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const f of fs.readdirSync(root)) {
  if (!f.startsWith("careers-job-") || !f.endsWith(".html")) continue;
  const p = path.join(root, f);
  let t = fs.readFileSync(p, "utf8");
  const n = t.replace(/contact\?job=([^#"]+)#contact-form-heading/g, "contact?job=$1");
  if (n !== t) {
    fs.writeFileSync(p, n, "utf8");
    console.log("updated", f);
  }
}
