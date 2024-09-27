import React from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Sidebar } from "@/components/sidebar";
import { truncateOnWord } from "@/lib/string";
import {
  JosephinFont,
  fontDisplay,
  geistMono,
  geistSans,
} from "@/styles/fonts";
import "@/styles/globals.css";
import { siteConfig } from "@/config";
import { cn } from "@/registry/ui/default/lib/cn";
import { Providers } from "./providers";

const config = siteConfig.global;

export const metadata: Metadata = {
  title: { default: config.title, template: `%s - ${config.name}` },
  description: truncateOnWord(config.description, 148, true),
  keywords: config.keywords,
  authors: config.authors,
  creator: config.creator,
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
          "font-sans",
          geistMono.variable,
          geistSans.variable,
          fontDisplay.variable,
          JosephinFont.variable
        )}
        suppressHydrationWarning
      >
        <Analytics />
        <Providers>
          {/* TODO: patch min-h-screen */}
          <div className="relative flex min-h-screen w-full flex-row">
            <Sidebar />
            <main className="relative min-h-full flex-1">{children}</main>

            {/* <Header /> */}
            {/* <div className="relative w-full flex-1">{children}</div> */}
            {/* <div className="relative min-h-full w-full">
              <div className="container max-w-7xl"></div>
            </div> */}
            {/* <Footer /> */}
          </div>
        </Providers>
      </body>
    </html>
  );
}
