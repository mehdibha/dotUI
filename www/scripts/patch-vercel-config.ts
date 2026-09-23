// Markdown for Agents — content negotiation on the homepage.
//
// The scanner (isitagentready.com / Cloudflare) sends `GET /` with
// `Accept: text/markdown` and expects a `text/markdown` response. The homepage
// is prerendered to a static index.html, and project-level rewrites both run
// after the filesystem AND conflict with Nitro's Build Output API. Rewriting `/`
// to the /home.md *server route* also fails: the catch-all forwards the original
// `/` to the page SSR, which rejects non-HTML ("Only HTML requests are supported
// here").
//
// So we emit a STATIC markdown homepage and route markdown requests to it at the
// filesystem layer (no function, no SSR):
//   1. write .vercel/output/static/home.md
//   2. force its content-type to text/markdown via Build Output `overrides`
//   3. inject a before-filesystem rewrite: `/` + Accept: text/markdown -> /home.md
// Browsers (Accept: text/html) don't match the `has` condition and keep the
// static HTML homepage. Runs in build:postprocess; a no-op for the node preset.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname } from "node:path"

import { HOME_MD } from "../src/config/home-md"

type Route = { src?: string; dest?: string; has?: unknown; handle?: string }

const CONFIG = ".vercel/output/config.json"
const STATIC_HOME_MD = ".vercel/output/static/home.md"

if (!existsSync(CONFIG)) {
  console.log(
    `[patch-vercel-config] ${CONFIG} not found — skipping (non-Vercel build).`,
  )
  process.exit(0)
}

// 1) Static markdown homepage — shadows the /home.md route on Vercel.
mkdirSync(dirname(STATIC_HOME_MD), { recursive: true })
writeFileSync(STATIC_HOME_MD, HOME_MD)

// 2) + 3) Override content-type and inject the rewrite.
const config = JSON.parse(readFileSync(CONFIG, "utf-8"))

config.overrides ??= {}
config.overrides["home.md"] = { contentType: "text/markdown; charset=utf-8" }

config.routes ??= []
const routes: Route[] = [
  {
    src: "/",
    has: [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }],
    dest: "/home.md",
  },
  // /studio is prerendered without a query, so its static HTML can't hydrate a
  // ?preset= or ?preview= link: those render on the server instead.
  ...["preset", "preview"].map((key) => ({
    src: "/studio/?",
    has: [{ type: "query", key }],
    dest: "/__server",
  })),
]
const existing: Route[] = config.routes
const missing = routes.filter(
  (route) =>
    !existing.some((r) => JSON.stringify(r) === JSON.stringify(route)),
)
const fsIndex = existing.findIndex((r) => r && r.handle === "filesystem")
existing.splice(fsIndex === -1 ? 0 : fsIndex, 0, ...missing)

writeFileSync(CONFIG, `${JSON.stringify(config, null, 2)}\n`)
console.log(
  "[patch-vercel-config] wrote static home.md, set text/markdown override, injected the markdown-negotiation and /studio query rewrites.",
)
