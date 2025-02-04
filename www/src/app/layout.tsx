import React from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { truncateOnWord } from "@/lib/string";
import { cn } from "@/lib/utils";
import { ThemeOverride } from "@/components/docs/theme-override";
import { fontMono, fontSans, josefinSans } from "@/styles/fonts";
import "@/styles/globals.css";
import { siteConfig } from "@/config";
import { Providers } from "./providers";

const config = siteConfig.global;

export const metadata: Metadata = {
  title: { default: config.title, template: `%s - ${config.name}` },
  description: truncateOnWord(config.description, 148, true),
  keywords: config.keywords,
  authors: config.authors,
  creator: config.creator,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: config.url,
    title: config.title,
    description: truncateOnWord(config.description, 148, true),
    siteName: config.name,
    images: [config.thumbnail],
  },
  twitter: {
    card: "summary_large_image",
    title: config.title,
    description: truncateOnWord(config.description, 148, true),
    images: [config.thumbnail],
    creator: config.twitter.creator,
  },
  metadataBase: new URL(config.url),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
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
          fontMono.variable
        )}
        style={{
          "--pattern-fg":
            "color-mix(in oklab, var(--color-fg) 10%, transparent)",
        } as React.CSSProperties}
        suppressHydrationWarning
      >
        <Analytics />
        <Providers>
          <ThemeOverride id="custom-theme-portal" className="bg-transparent" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
