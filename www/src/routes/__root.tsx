/// <reference types="vite/client" />

import { useEffect } from "react";

import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";

// Above-the-fold fonts: Geist (hero/body) and Josefin (header logo). Imported as
// URLs so we can <link rel="preload"> them — the browser fetches them in parallel
// with the HTML/CSS instead of only discovering them after the CSS is parsed, so
// they're ready by first paint and there's no flash of fallback text. Vite emits
// the same hashed asset the @fontsource CSS references, so this is not a 2nd fetch.
import geistFontUrl from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
import josefinFontUrl from "@fontsource-variable/josefin-sans/files/josefin-sans-latin-wght-normal.woff2?url";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "starter-themes";

import { siteConfig } from "@/config/site";
import { truncateOnWord } from "@/lib/text";
import { usePreviewForcedTheme } from "@/modules/create/preset";
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
				// Preload above-the-fold fonts so they're fetched in parallel with the
				// document (not discovered late, after CSS parse). `crossorigin` is
				// required even same-origin — fonts fetch in CORS mode, and without it
				// the preload wouldn't match the actual request, causing a double fetch.
				{ rel: "preload", href: geistFontUrl, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
				{ rel: "preload", href: josefinFontUrl, as: "font", type: "font/woff2", crossOrigin: "anonymous" },
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
// in-app theme toggle), the way GitHub does: one persistent SVG <link> whose
// href we swap between the light and dark files when `prefers-color-scheme`
// changes. Two things this relies on:
//   1. The SVG files are static (no internal media query): browsers evaluate a
//      `prefers-color-scheme` query inside an SVG favicon only once, so the file
//      itself has to be swapped from JS.
//   2. We mutate the href of a single, JS-owned <link> (kept out of `head()` so
//      <HeadContent> never resets it). Replacing the element each time — remove
//      + re-append — does NOT reliably make Chrome re-render the icon; changing
//      the href of a stable element does (this is exactly GitHub's approach).
const FAVICON_ID = "favicon-svg";

function FaviconSwitcher() {
	useEffect(() => {
		const media = window.matchMedia("(prefers-color-scheme: dark)");

		// Create the JS-owned <link> once, then only ever mutate its href.
		let existing = document.getElementById(FAVICON_ID) as HTMLLinkElement | null;
		if (!existing) {
			existing = document.createElement("link");
			existing.id = FAVICON_ID;
			existing.rel = "icon";
			existing.type = "image/svg+xml";
			document.head.appendChild(existing);
		}
		const link = existing;

		const apply = (isDark: boolean) => {
			link.href = isDark ? "/favicon-dark.svg" : "/favicon.svg";
		};

		apply(media.matches);
		const onChange = (e: MediaQueryListEvent) => apply(e.matches);
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, []);

	return null;
}

function RootComponent() {
	// In the /create preview iframe, the customizer owns the displayed mode — force it so the
	// provider's own system / storage listeners can't revert it. `undefined` everywhere else.
	const forcedTheme = usePreviewForcedTheme();
	return (
		<ThemeProvider forcedTheme={forcedTheme}>
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
