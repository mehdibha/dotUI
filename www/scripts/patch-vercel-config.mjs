// Markdown for Agents — content negotiation on the homepage.
//
// The scanner (isitagentready.com / Cloudflare) sends `GET /` with
// `Accept: text/markdown` and expects a `text/markdown` response. Our homepage
// is prerendered to a static index.html, which Vercel serves from the CDN
// *before* any project-level rewrite runs — and project `rewrites` in vercel.ts
// conflict with the Nitro Build Output API. So we inject a before-filesystem
// rewrite directly into the generated Build Output config: when the request
// asks for markdown, `/` is rewritten to `/home.md` (served by the function as
// text/markdown); browsers (Accept: text/html) fall through to the static HTML.
//
// This mirrors how a Next.js `beforeFiles` rewrite compiles: a `has`-header
// route with `continue: true`, placed before the `{ handle: "filesystem" }`
// marker. Runs in build:postprocess; a no-op for the non-Vercel (node) preset.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const CONFIG = ".vercel/output/config.json";

if (!existsSync(CONFIG)) {
	console.log(`[patch-vercel-config] ${CONFIG} not found — skipping (non-Vercel build).`);
	process.exit(0);
}

const config = JSON.parse(readFileSync(CONFIG, "utf-8"));
config.routes ??= [];

// No `continue: true`: the rewritten path (/home.md) must propagate to the
// filesystem→function phase so Nitro serves the /home.md route. With `continue`,
// the catch-all `/(.*) -> /__server` re-forwards the original `/` to the page
// SSR, which rejects non-HTML requests ("Only HTML requests are supported here").
const route = {
	src: "/",
	has: [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }],
	dest: "/home.md",
};

const already = config.routes.some((r) => r && r.src === route.src && r.dest === route.dest && r.has);
if (already) {
	console.log("[patch-vercel-config] markdown-negotiation route already present — skipping.");
	process.exit(0);
}

const fsIndex = config.routes.findIndex((r) => r && r.handle === "filesystem");
const insertAt = fsIndex === -1 ? 0 : fsIndex;
config.routes.splice(insertAt, 0, route);

writeFileSync(CONFIG, `${JSON.stringify(config, null, 2)}\n`);
console.log(`[patch-vercel-config] injected markdown-negotiation route at index ${insertAt} (before filesystem).`);
