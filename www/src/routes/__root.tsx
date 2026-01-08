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
import { ThemeProvider } from "starter-themes";
import type { QueryClient } from "@tanstack/react-query";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";

import type { AppRouter } from "@dotui/api";

import { siteConfig } from "@/config/site";
import { truncateOnWord } from "@/lib/text";
import appCss from "@/styles.css?url";

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient;
	trpc: TRPCOptionsProxy<AppRouter>;
}>()({
	head: () => {
		const title = `${siteConfig.title} - ${siteConfig.description}`;
		const description = truncateOnWord(siteConfig.description, 148, true);
		const ogImageUrl = `${siteConfig.url}/og?title=${encodeURIComponent(siteConfig.og.title)}&description=${encodeURIComponent(siteConfig.og.description)}`;

		return {
			meta: [
				{ charSet: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ title },
				{ name: "description", content: description },
				{ name: "keywords", content: siteConfig.keywords.join(", ") },
				{ name: "author", content: siteConfig.creator },
				{ property: "og:type", content: "website" },
				{ property: "og:locale", content: "en_US" },
				{ property: "og:url", content: siteConfig.url },
				{ property: "og:title", content: title },
				{ property: "og:description", content: description },
				{ property: "og:site_name", content: siteConfig.name },
				{ property: "og:image", content: ogImageUrl },
				{ name: "twitter:card", content: "summary_large_image" },
				{ name: "twitter:title", content: title },
				{ name: "twitter:description", content: description },
				{ name: "twitter:image", content: ogImageUrl },
				{ name: "twitter:creator", content: siteConfig.twitter.creator },
			],
			links: [
				{ rel: "stylesheet", href: appCss },
				{ rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" },
				{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
				{ rel: "shortcut icon", href: "/favicon.ico" },
				{ rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
				{ rel: "manifest", href: "/site.webmanifest" },
			],
		};
	},
	component: RootComponent,
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
				return router.navigate({ ...href, ...opts });
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
