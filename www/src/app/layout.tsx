import React from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { GeistSans } from "geist/font/sans";
import { truncateOnWord } from "@/lib/string";
import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";
import { Badge } from "@/registry/ui/default/core/badge";
import { cn } from "@/registry/ui/default/lib/cn";
import "@/styles/globals.css";
import { siteConfig } from "@/config";
import { Providers } from "./providers";
import { source } from "./source";

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
        className={cn("font-sans antialiased", GeistSans.variable)}
        suppressHydrationWarning
      >
        <Analytics />
        <Providers>
          {/* TODO: patch min-h-screen */}
          <div className="relative w-full sm:flex sm:flex-row">
            <MobileNav items={source.pageTree.children} />
            <Sidebar items={source.pageTree.children} />
            <main className="relative flex-1">
              <Badge
                size="md"
                variant="neutral"
                className="absolute right-3 top-3 border text-[#e9e5e5]"
              >
                v0.1.0 beta
              </Badge>
              {children}
            </main>
          </div>
          {/* <div className="flex min-h-screen flex-col sm:flex-row">
            <MobileNav items={source.pageTree.children} />
            <Sidebar items={source.pageTree.children} />
            <main className="relative flex-1 overflow-hidden xl:overflow-visible">
              <Badge
                size="md"
                variant="neutral"
                className="absolute right-3 top-3 border text-[#e9e5e5]"
              >
                v0.1.0 beta
              </Badge>
              {children}
            </main>
          </div> */}
        </Providers>
      </body>
    </html>
  );
}
