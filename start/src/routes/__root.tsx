/// <reference types="vite/client" />

import {
	createRootRouteWithContext,
	HeadContent,
	type NavigateOptions,
	Outlet,
	Scripts,
	type ToOptions,
	useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { RouterProvider } from "react-aria-components";
import type { QueryClient } from "@tanstack/react-query";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";

import type { AppRouter } from "@dotui/api";

import { NotFound } from "@/components/not-found";
import { ThemeProvider } from "@/modules/theme/provider";
import appCss from "@/styles.css?url";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
	trpc: TRPCOptionsProxy<AppRouter>;
}>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "dotUI" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	component: RootComponent,
	notFoundComponent: NotFound,
});

declare module "react-aria-components" {
	interface RouterConfig {
		href: ToOptions;
		routerOptions: Omit<NavigateOptions, keyof ToOptions>;
	}
}

function RootComponent() {
	const router = useRouter();
	return (
		<RouterProvider
			navigate={(href, opts) => {
				if (typeof href === "string") return;
				router.navigate({ ...href, ...opts });
			}}
			useHref={(href) => {
				if (typeof href === "string") return href;
				return router.buildLocation(href).href;
			}}
		>
			<ThemeProvider>
				<RootDocument>
					<Outlet />
				</RootDocument>
			</ThemeProvider>
		</RouterProvider>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="min-h-screen bg-bg font-sans text-fg antialiased">
				{children}
				<TanStackRouterDevtools position="bottom-right" />
				<Scripts />
			</body>
		</html>
	);
}
