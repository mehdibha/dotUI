import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

import { auth } from "./server";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
	const headers = getRequestHeaders();
	const session = await auth.api.getSession({ headers });

	if (!session) {
		throw redirect({ to: "/login" });
	}

	return next({ context: { session } });
});

export const guestMiddleware = createMiddleware().server(async ({ next, request }) => {
	const headers = getRequestHeaders();
	const session = await auth.api.getSession({ headers });

	if (session?.user) {
		const url = new URL(request.url);
		const callbackUrl = url.searchParams.get("callbackUrl") || "/";
		throw redirect({ to: callbackUrl });
	}

	return next();
});
