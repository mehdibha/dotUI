/**
 * Verification harness for the "Open in v0" showcase bundle.
 *
 * Materializes the generated bundle into a standalone Vite + React + Tailwind v4
 * project under `www/.v0-verify/`, mirroring what v0 scaffolds (a `src/`-rooted
 * project with `@/*` → `./src/*`). The harness reuses www's node_modules, so no
 * install is needed — run `pnpm exec vite --config .v0-verify/vite.config.ts`.
 *
 * This proves the bundle is self-contained and renders: all imports resolve, the
 * stubs hold, the theme applies. It tests the DEFAULT preset (colors.css copied
 * from the committed default ramps); custom-color presets are verified through
 * the live `/r/showcase-bundle?preset=…` route.
 *
 * Not shipped — a dev-only test rig.
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'

import {
  SHOWCASE_BUNDLE_CSS_FILES,
  SHOWCASE_BUNDLE_SOURCE_FILES,
} from '../src/registry/__generated__/showcase-bundle'
import {
  DEFAULT_COLOR_CONFIG,
  emitPrimitivesCss,
  resolveColorConfig,
} from '../src/registry/theme'

const WWW = process.cwd()
const HARNESS = path.join(WWW, '.v0-verify')

// Static globals.css — kept in sync with src/publisher/emit-bundle-css.ts.
const GLOBALS_CSS = `@import "tailwindcss";

@import "@fontsource-variable/geist";
@import "@fontsource/geist-mono";

@import "../registry/styles.css";

@source "../registry/**/*.{ts,tsx}";
@source "../components/**/*.{ts,tsx}";
@source "./**/*.{ts,tsx}";

@theme {
\t--font-geist-sans: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
\t--font-geist-mono: "Geist Mono", ui-monospace, monospace;
}
`

const PAGE_TSX = `"use client";

import Cards from "../components/marketing/showcase/cards";
import { DesignSystemProvider } from "../modules/core/styles";

export default function Page() {
\treturn (
\t\t<DesignSystemProvider density="compact" params={{}}>
\t\t\t<main className="min-h-screen bg-bg px-4 py-10 sm:px-8">
\t\t\t\t<div className="mx-auto max-w-7xl">
\t\t\t\t\t<Cards />
\t\t\t\t</div>
\t\t\t</main>
\t\t</DesignSystemProvider>
\t);
}
`

const MAIN_TSX = `import "./app/globals.css";

import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import Page from "./app/page";

createRoot(document.getElementById("root")!).render(
\t<StrictMode>
\t\t<Page />
\t</StrictMode>,
);
`

const INDEX_HTML = `<!doctype html>
<html lang="en">
\t<head>
\t\t<meta charset="UTF-8" />
\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0" />
\t\t<title>dotUI · Open in v0 verify</title>
\t</head>
\t<body>
\t\t<div id="root"></div>
\t\t<script type="module" src="/main.tsx"></script>
\t</body>
</html>
`

// NO `@/` alias — a strict test that the bundle uses only relative + npm
// imports (v0 rewrites `@/registry/*` aliases, so any residual `@/` would break
// there). If something still imports `@/…`, the harness fails loudly here.
const VITE_CONFIG = `import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
\troot: path.resolve(import.meta.dirname),
\tresolve: {
\t\t// The harness reuses www/node_modules; force a single React copy.
\t\tdedupe: ["react", "react-dom"],
\t},
\tplugins: [tailwindcss(), react()],
\tserver: { port: 4455 },
});
`

async function writeFile(rel: string, content: string) {
  const abs = path.join(HARNESS, rel)
  await fs.mkdir(path.dirname(abs), { recursive: true })
  await fs.writeFile(abs, content, 'utf8')
}

async function main() {
  await fs.rm(HARNESS, { recursive: true, force: true })
  await fs.mkdir(HARNESS, { recursive: true })

  // Closure: source + mirrored CSS, written at their `src/…` targets.
  for (const f of [
    ...SHOWCASE_BUNDLE_SOURCE_FILES,
    ...SHOWCASE_BUNDLE_CSS_FILES,
  ]) {
    await writeFile(f.target, f.content)
  }

  // Default-preset theme: ramps + baked `--on-*` foregrounds (matches the route).
  const colorsCss = emitPrimitivesCss(
    resolveColorConfig(DEFAULT_COLOR_CONFIG),
    { onColors: true },
  )
  await writeFile('registry/base/colors.css', colorsCss)

  // App shell + Vite scaffold.
  await writeFile('app/globals.css', GLOBALS_CSS)
  await writeFile('app/page.tsx', PAGE_TSX)
  await writeFile('main.tsx', MAIN_TSX)
  await writeFile('index.html', INDEX_HTML)
  await writeFile('vite.config.ts', VITE_CONFIG)

  console.log(`✓ materialized harness at ${HARNESS}`)
  console.log(`  run: pnpm exec vite --config .v0-verify/vite.config.ts`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
