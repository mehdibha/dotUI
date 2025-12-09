import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import { initAuth } from "@dotui/auth";

import { env } from "@/env";

const baseUrl =
	env.VERCEL_ENV === "production"
		? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
		: env.VERCEL_ENV === "preview"
			? `https://${env.VERCEL_URL}`
			: "http://localhost:4444";

const productionUrl =
	env.VERCEL_GIT_COMMIT_REF === "update-components"
		? "https://beta.dotui.org"
		: env.VERCEL_PROJECT_PRODUCTION_URL
			? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
			: "https://dotui.org";

export const auth = initAuth({
	baseUrl,
	productionUrl,
	secret: env.AUTH_SECRET,
	githubClientId: env.GITHUB_CLIENT_ID,
	githubClientSecret: env.GITHUB_CLIENT_SECRET,
});

export const getSession = cache(async () => auth.api.getSession({ headers: await headers() }));
