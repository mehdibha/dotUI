import { routes, type VercelConfig } from "@vercel/config/v1";

// RFC 8288 Link header advertising machine-discoverable resources for agents:
// the RFC 9727 API catalog, the sitemap, and the llms.txt index. Markdown
// variants are advertised per-page via <link rel="alternate" type="text/markdown">
// (see __root/docs/home routes) and served at /home.md and /docs/*.md.
const DISCOVERY_LINK =
	'</.well-known/api-catalog>; rel="api-catalog", </sitemap.xml>; rel="sitemap", </llms.txt>; rel="describedby"; type="text/plain"';

export const config: VercelConfig = {
	outputDirectory: ".vercel/output",
	headers: [
		routes.cacheControl("/__tsr/staticServerFnCache/(.*)", {
			public: true,
			maxAge: "1 year",
			immutable: true,
		}),
		// Advertise agent-discovery resources on every response.
		routes.header("/(.*)", [{ key: "Link", value: DISCOVERY_LINK }]),
	],
};
