import { routes, type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
	outputDirectory: ".vercel/output",
	headers: [
		routes.cacheControl("/__tsr/staticServerFnCache/(.*)", {
			public: true,
			maxAge: "1 year",
			immutable: true,
		}),
	],
};
