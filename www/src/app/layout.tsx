import React from "react";
import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import { truncateOnWord } from "@/lib/string";
import { cn } from "@/lib/utils";
import { fontMono, fontSans, josefinSans } from "@/styles/fonts";
import "@/styles/globals.css";
import { siteConfig } from "@/config";
import { ThemeProvider } from "@/modules/themes/components/theme-provider";
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultMode = (cookieStore.get("preview-mode")?.value ?? null) as
    | "light"
    | "dark"
    | null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "font-sans antialiased",
          josefinSans.variable,
          fontSans.variable,
          fontMono.variable
        )}
        suppressHydrationWarning
      >
        <Analytics />
        <Providers defaultPreviewMode={defaultMode}>
          <div>
            <ThemeProvider id="custom-theme-portal" unstyled />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
