/// <reference types="vite/client" />

import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "starter-themes";

import { siteConfig } from "@/config/site";
import { truncateOnWord } from "@/lib/text";
import { DrawerIndent, DrawerIndentBackground, DrawerProvider } from "@/registry/ui/drawer";
import appCss from "@/styles.css?url";

export const Route = createRootRoute({
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

// declare module "react-aria-components" {
// 	interface RouterConfig {
// 		href: ToOptions;
// 		routerOptions: Omit<NavigateOptions, keyof ToOptions>;
// 	}
// }

function RootComponent() {
	return (
		<ThemeProvider>
			<DrawerProvider>
				<RootDocument>
					<DrawerIndentBackground />
					<DrawerIndent>
						<Outlet />
					</DrawerIndent>
				</RootDocument>
			</DrawerProvider>
		</ThemeProvider>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				{/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" /> */}
				<HeadContent />
			</head>
			<body className="min-h-screen bg-bg font-sans text-fg antialiased">
				{children}
				{/* <TanStackRouterDevtools position="bottom-right" /> */}
				<Scripts />
			</body>
		</html>
	);
}
