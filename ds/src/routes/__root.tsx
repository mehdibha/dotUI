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
import { ThemeToggle } from '@/components/theme-toggle'

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
        <header className="border-b">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3.5">
            <Link to="/" className="flex items-baseline gap-3">
              <span className="text-lg font-semibold tracking-tight">ds.</span>
              <span className="hidden font-mono text-[11px] tracking-widest text-fg-muted uppercase sm:inline">
                design-systems archive
              </span>
            </Link>
            <nav className="flex items-center gap-5 text-sm text-fg-muted">
              <Link
                to="/"
                className="transition-colors hover:text-fg"
                activeProps={{ className: 'text-fg' }}
                activeOptions={{ exact: true }}
              >
                Archive
              </Link>
              <Link
                to="/methodology"
                className="transition-colors hover:text-fg"
                activeProps={{ className: 'text-fg' }}
              >
                Methodology
              </Link>
              <a
                href="https://github.com/mehdibha/dotUI/tree/main/ds"
                className="transition-colors hover:text-fg"
              >
                GitHub
              </a>
              <ThemeToggle variant="quiet" size="sm" isIconOnly />
            </nav>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="border-t">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-8 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="text-sm text-fg-muted">
              Built by{' '}
              <a
                href="https://dotui.org"
                className="text-fg underline underline-offset-2"
              >
                dotUI
              </a>
              . The builder follows this research — not the reverse.
            </p>
            <p className="font-mono text-xs text-fg-muted">
              open data · every fact cited and dated
            </p>
          </div>
        </footer>
        <Scripts />
      </body>
    </html>
  )
}
