import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import type React from "react";

import { cn } from "@dotui/registry/lib/utils";

import {
	dmSans,
	fontMono,
	fontSans,
	inter,
	josefinSans,
	montserrat,
	nunito,
	openSans,
	raleway,
	roboto,
	workSans,
} from "@/lib/fonts";
import { truncateOnWord } from "@/lib/text";

import "@/styles/globals.css";

import { Toaster } from "@dotui/registry/ui/toast";

import { siteConfig } from "@/config/site";
import { env } from "@/env";

import { Providers } from "./providers";

export const metadata: Metadata = {
	title: {
		default: `${siteConfig.title} - ${siteConfig.description}`,
		template: `%s - ${siteConfig.name}`,
	},
	description: truncateOnWord(siteConfig.description, 148, true),
	keywords: siteConfig.keywords,
	authors: siteConfig.authors,
	creator: siteConfig.creator,
	openGraph: {
		type: "website",
		locale: "en_US",
		url: env.VERCEL_URL ? `https://${env.VERCEL_URL}` : siteConfig.url,
		title: `${siteConfig.title} - ${siteConfig.description}`,
		description: truncateOnWord(siteConfig.description, 148, true),
		siteName: siteConfig.name,
		images: [
			{
				url: `/og?title=${encodeURIComponent(
					siteConfig.og.title,
				)}&description=${encodeURIComponent(siteConfig.og.description)}`,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `${siteConfig.title} - ${siteConfig.description}`,
		description: truncateOnWord(siteConfig.description, 148, true),
		images: [
			{
				url: `/og?title=${encodeURIComponent(
					siteConfig.og.title,
				)}&description=${encodeURIComponent(siteConfig.og.description)}`,
			},
		],
		creator: siteConfig.twitter.creator,
	},
	metadataBase: new URL(env.VERCEL_URL ? `https://${env.VERCEL_URL}` : siteConfig.url),
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className={cn(
				inter.className,
				roboto.className,
				openSans.className,
				montserrat.className,
				raleway.className,
				workSans.className,
				dmSans.className,
				nunito.className,
			)}
			suppressHydrationWarning
		>
			<head>
				{/* <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        /> */}
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
			</head>
			<body
				className={cn(
					"font-sans antialiased [--header-height:calc(var(--spacing)*13)]",
					fontSans.variable,
					fontMono.variable,
					josefinSans.variable,
				)}
				suppressHydrationWarning
			>
				<Analytics />
				<Providers>
					<Toaster />
					<div>{children}</div>
				</Providers>
			</body>
		</html>
	);
}
