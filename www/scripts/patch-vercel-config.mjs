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
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const CONFIG = ".vercel/output/config.json";
const STATIC_HOME_MD = ".vercel/output/static/home.md";

if (!existsSync(CONFIG)) {
	console.log(`[patch-vercel-config] ${CONFIG} not found — skipping (non-Vercel build).`);
	process.exit(0);
}

// 1) Static markdown homepage (mirrors the /home.md route).
const HOME_MD = `# dotUI

> Build your design system in seconds, so your app looks like your brand, not a preset.

dotUI is a design system platform and component registry built on React Aria Components, Tailwind CSS 4, and TypeScript 5. Generate a UI library that looks like your product — not a preset — with the style editor, then consume it through the shadcn CLI, the registry endpoint, or AI tooling like v0.

## Documentation

- Introduction: https://dotui.org/docs
- Installation: https://dotui.org/docs/installation
- Components index (llms.txt): https://dotui.org/llms.txt
- Full documentation, single file (llms-full.txt): https://dotui.org/llms-full.txt
- Component registry API: GET https://dotui.org/r/{name}

## Links

- GitHub: https://github.com/mehdibha/dotUI
- X (Twitter): https://x.com/mehdibha
- Discord: https://discord.gg/DXpj5V2fU8
`;

mkdirSync(dirname(STATIC_HOME_MD), { recursive: true });
writeFileSync(STATIC_HOME_MD, HOME_MD);

// 2) + 3) Override content-type and inject the rewrite.
const config = JSON.parse(readFileSync(CONFIG, "utf-8"));

config.overrides ??= {};
config.overrides["home.md"] = { contentType: "text/markdown; charset=utf-8" };

config.routes ??= [];
const route = {
	src: "/",
	has: [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }],
	dest: "/home.md",
};
const already = config.routes.some((r) => r && r.src === route.src && r.dest === route.dest && r.has);
if (!already) {
	const fsIndex = config.routes.findIndex((r) => r && r.handle === "filesystem");
	config.routes.splice(fsIndex === -1 ? 0 : fsIndex, 0, route);
}

writeFileSync(CONFIG, `${JSON.stringify(config, null, 2)}\n`);
console.log(
	"[patch-vercel-config] wrote static home.md, set text/markdown override, injected markdown-negotiation rewrite.",
);
