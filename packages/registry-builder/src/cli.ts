#!/usr/bin/env node
import path from "node:path";

import { buildRegistry } from "./build";

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let srcDir = path.resolve(process.cwd(), "../registry/src");
  let outDir = path.resolve(process.cwd(), "dist");
  let pretty = true;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];
    if (arg === "--src" && nextArg) {
      srcDir = path.resolve(nextArg);
      i++;
    } else if (arg === "--out" && nextArg) {
      outDir = path.resolve(nextArg);
      i++;
    } else if (arg === "--no-pretty") {
      pretty = false;
    }
  }

  await buildRegistry({ srcDir, outDir, pretty });
}

main().catch((error) => {
  console.error("Build failed:", error);
  process.exit(1);
});
