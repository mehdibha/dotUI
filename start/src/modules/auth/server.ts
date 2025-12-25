import { tanstackStartCookies } from "better-auth/tanstack-start";

import { initAuth } from "@dotui/auth";

import { env } from "@/env";
import { getBaseUrl } from "@/lib/url";

export const auth = initAuth({
	baseUrl: getBaseUrl(),
	productionUrl: `https://${env.VERCEL_PROJECT_PRODUCTION_URL ?? "dotui.org"}`,
	secret: env.AUTH_SECRET,
	githubClientId: env.GITHUB_CLIENT_ID,
	githubClientSecret: env.GITHUB_CLIENT_SECRET,
	extraPlugins: [tanstackStartCookies()],
});
