import { createFileRoute } from "@tanstack/react-router";

import { siteConfig } from "@/config/site";
import { docsSource, legalSource } from "@/lib/source";

// Serves /sitemap.xml — a valid XML sitemap covering every canonical page:
// the top-level routes plus all docs and legal pages, generated from the docs
// source so new components appear automatically. Referenced from robots.txt and
// prerendered to a static /sitemap.xml at build time.
//
// Spec: https://www.sitemaps.org/protocol.html

const STATIC_PATHS = ["/", "/components", "/create", "/playground"];

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: () => {
				const paths = [
					...STATIC_PATHS,
					...docsSource.getPages().map((page) => page.url),
					...legalSource.getPages().map((page) => page.url),
				];

				const urls = paths.map((path) => `\t<url>\n\t\t<loc>${siteConfig.url}${path}</loc>\n\t</url>`).join("\n");

				const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

				return new Response(body, {
					headers: { "Content-Type": "application/xml; charset=utf-8" },
				});
			},
		},
	},
});
