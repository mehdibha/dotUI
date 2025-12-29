import { createFileRoute } from "@tanstack/react-router";

import { getSafeCallbackUrl } from "@/lib/get-safe-callback-url";
import { LoginForm } from "@/modules/auth/login-form";
import { guestMiddleware } from "@/modules/auth/middleware";

export const Route = createFileRoute("/login")({
	component: LoginPage,
	validateSearch: (search: Record<string, unknown>): { callbackUrl?: string } => ({
		callbackUrl: typeof search.callbackUrl === "string" ? search.callbackUrl : undefined,
	}),
	server: {
		middleware: [guestMiddleware],
	},
});

function LoginPage() {
	const { callbackUrl } = Route.useSearch();
	const safeCallbackUrl = getSafeCallbackUrl(callbackUrl);

	return (
		<div className="relative flex min-h-svh w-full">
			<LoginForm callbackUrl={safeCallbackUrl} />
		</div>
	);
}
