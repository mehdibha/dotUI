import { createFileRoute, redirect } from "@tanstack/react-router";

import { getSafeCallbackUrl } from "@/lib/get-safe-callback-url";
import { LoginForm } from "@/modules/auth/login-form";
import { getSession } from "@/modules/auth/server";

export const Route = createFileRoute("/login")({
	component: LoginPage,
	validateSearch: (search: Record<string, unknown>) => ({
		callbackUrl: (search.callbackUrl as string) || undefined,
	}),
	beforeLoad: async ({ search }) => {
		const session = await getSession();
		const safeCallbackUrl = getSafeCallbackUrl(search.callbackUrl);

		if (session?.user) {
			throw redirect({ to: safeCallbackUrl });
		}

		return { callbackUrl: safeCallbackUrl };
	},
	loader: ({ context }) => {
		return { callbackUrl: context.callbackUrl };
	},
});

function LoginPage() {
	const { callbackUrl } = Route.useLoaderData();

	return (
		<div className="relative flex min-h-svh w-full">
			<LoginForm callbackUrl={callbackUrl} />
		</div>
	);
}
