import React from "react";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";

import { cn } from "@dotui/ui/lib/utils";

import { fontMono, fontSans, josefinSans } from "@/lib/fonts";
import { truncateOnWord } from "@/lib/string";

import "@dotui/ui/globals.css";

import { siteConfig } from "@/config";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: { default: siteConfig.title, template: `%s - ${siteConfig.name}` },
  description: truncateOnWord(siteConfig.description, 148, true),
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.title,
    description: truncateOnWord(siteConfig.description, 148, true),
    siteName: siteConfig.name,
    images: [siteConfig.thumbnail],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: truncateOnWord(siteConfig.description, 148, true),
    images: [siteConfig.thumbnail],
    creator: siteConfig.twitter.creator,
  },
  metadataBase: new URL(siteConfig.url),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </head>
      <body
        className={cn(
          "font-sans antialiased",
          josefinSans.variable,
          fontSans.variable,
          fontMono.variable,
        )}
        suppressHydrationWarning
      >
        <Analytics />
        {/* TODO FIX THIS */}
        <Providers defaultPreviewMode="light">
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
