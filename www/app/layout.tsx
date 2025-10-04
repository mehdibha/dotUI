import React from "react";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";

import { cn } from "@dotui/registry/lib/utils";

import { fontMono, fontSans, josefinSans } from "@/lib/fonts";
import { truncateOnWord } from "@/lib/string";

import "@/styles/globals.css";

import { Toaster } from "@dotui/registry/ui/toast";

import { siteConfig } from "@/config";
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
  metadataBase: new URL(
    env.VERCEL_URL ? `https://${env.VERCEL_URL}` : siteConfig.url,
  ),
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
      {/* <head>
        <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </head> */}
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
        <Providers>
          <Toaster />
          <div>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
