// ORIGINALLY FROM CLOUDFLARE WRANGLER:
// https://github.com/cloudflare/wrangler2/blob/main/.github/version-script.js

import { exec } from "node:child_process";
import fs from "node:fs";

const pkgJsonPath = "packages/tailwindcss-autocontrast/package.json";
try {
  const pkg = JSON.parse(fs.readFileSync(pkgJsonPath));
  exec("git rev-parse --short HEAD", (err, stdout) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    const [major, minor, patch] = pkg.version.split(".").map(Number);
    pkg.version = `${major}.${minor}.${patch + 1}-beta.${stdout.trim()}`;
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, "\t") + "\n");
  });
} catch (error) {
  console.error(error);
  process.exit(1);
}
