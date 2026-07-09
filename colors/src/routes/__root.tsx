/// <reference types="vite/client" />

import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { ThemeProvider } from 'starter-themes'

import { siteConfig } from '@/config/site'
import { ChapterTocSelect } from '@/components/chapter-toc'
import { GitHubIcon } from '@/components/icons/github'
import { ProgressiveBlur } from '@/components/progressive-blur'
import { ThemeToggle } from '@/components/theme-toggle'
import { LinkButton } from '@/ui/button'

import appCss from '@/styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: siteConfig.title },
      { name: 'description', content: siteConfig.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: siteConfig.url },
      { property: 'og:title', content: siteConfig.title },
      { property: 'og:description', content: siteConfig.description },
      { property: 'og:site_name', content: siteConfig.name },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider>
      <RootDocument />
    </ThemeProvider>
  )
}

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col bg-bg font-sans text-fg antialiased">
        <header className="sticky top-0 z-30 header-blur-fallback">
          {/* iOS-style progressive blur revealed on scroll — the header-blur-reveal
              scroll timeline (styles.css) ramps --blur-progress over the first
              header-height of scroll. */}
          <ProgressiveBlur className="header-blur-reveal" />
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-baseline gap-3">
                <span className="text-lg font-semibold tracking-tight">
                  colors<span className="text-fg-muted">.dotui.org</span>
                </span>
              </Link>
              {/* Small screens have no in-page lines TOC (that's lg+); surface
                  the chapter headings here next to the logo instead. Null off
                  chapter pages. */}
              <ChapterTocSelect className="lg:hidden" />
            </div>
            <nav className="flex items-center gap-1 text-sm text-fg-muted">
              <LinkButton
                href="https://github.com/mehdibha/dotUI/tree/main/colors"
                aria-label="GitHub"
                variant="quiet"
                size="sm"
                isIconOnly
              >
                <GitHubIcon />
              </LinkButton>
              <ThemeToggle variant="quiet" size="sm" isIconOnly />
            </nav>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="mx-auto w-full max-w-4xl px-6 py-10">
          <p className="text-sm text-fg-muted">
            Built with passion by{' '}
            <a
              href="https://x.com/mehdibha"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              @mehdibha
            </a>
            .
          </p>
        </footer>
        <Scripts />
      </body>
    </html>
  )
}
