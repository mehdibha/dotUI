/// <reference types="vite/client" />

import { useEffect } from "react";

import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";

// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "starter-themes";

import { siteConfig } from "@/config/site";
import { truncateOnWord } from "@/lib/text";
import { ToastProvider } from "@/registry/ui/toast";
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
				// The SVG favicon is injected by <FaviconSwitcher /> and kept in sync
				// with the system color scheme. These PNG/ICO entries are the fallback
				// for SSR, no-JS, and browsers without SVG favicon support (kept as
				// `alternate icon` so the SVG stays the primary icon, like GitHub).
				{ rel: "alternate icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" },
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

// Keep the favicon in sync with the system color scheme (independent of the
// in-app theme toggle), the way GitHub does. Two gotchas this works around:
//   1. Browsers evaluate a `prefers-color-scheme` media query inside an SVG
//      favicon only once, so the file itself has to be swapped from JS.
//   2. Mutating the href of an existing <link> usually doesn't force a re-render
//      (and TanStack's <HeadContent> would reset it), so we own a dedicated
//      <link> and replace the element on every change instead.
const FAVICON_ID = "favicon-svg";

function FaviconSwitcher() {
	useEffect(() => {
		const media = window.matchMedia("(prefers-color-scheme: dark)");

		const apply = (isDark: boolean) => {
			document.getElementById(FAVICON_ID)?.remove();
			const link = document.createElement("link");
			link.id = FAVICON_ID;
			link.rel = "icon";
			link.type = "image/svg+xml";
			link.href = isDark ? "/favicon-dark.svg" : "/favicon.svg";
			document.head.appendChild(link);
		};

		apply(media.matches);
		const onChange = (e: MediaQueryListEvent) => apply(e.matches);
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, []);

	return null;
}

function RootComponent() {
	return (
		<ThemeProvider>
			<FaviconSwitcher />
			{/* <DrawerProvider> */}
			<RootDocument>
				{/* <DrawerIndentBackground /> */}
				{/* <DrawerIndent> */}
				<ToastProvider>
					<Outlet />
				</ToastProvider>
				{/* </DrawerIndent> */}
			</RootDocument>
			{/* </DrawerProvider> */}
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
