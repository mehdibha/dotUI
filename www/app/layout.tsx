import React from "react";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";

import { cn } from "@dotui/ui/lib/utils";

import { fontMono, fontSans, josefinSans } from "@/lib/fonts";
import { truncateOnWord } from "@/lib/string";

import "@/styles/globals.css";

import { Toaster } from "@dotui/ui/components/toast";

import { siteConfig } from "@/config";
import { Providers } from "./providers";

const ogTitle = "Ship unique.";
const ogDescription =
  "Build your design system in seconds, so your app look like your brand, not a preset.";

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
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          ogTitle,
        )}&description=${encodeURIComponent(ogDescription)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: truncateOnWord(siteConfig.description, 148, true),
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          ogTitle,
        )}&description=${encodeURIComponent(ogDescription)}`,
      },
    ],
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
