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
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
            <Link to="/" className="text-lg font-semibold tracking-tight">
              ds.
            </Link>
            <nav className="flex items-center gap-6 text-sm text-fg-muted">
              <Link to="/" className="hover:text-fg">
                Systems
              </Link>
              <Link to="/methodology" className="hover:text-fg">
                Methodology
              </Link>
              <ThemeToggle variant="quiet" size="sm" isIconOnly />
            </nav>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="border-t">
          <p className="mx-auto w-full max-w-4xl px-6 py-6 text-sm text-fg-muted">
            Built by{' '}
            <a
              href="https://dotui.org"
              className="text-fg underline underline-offset-2"
            >
              dotUI
            </a>
            . The builder follows this research — not the reverse.
          </p>
        </footer>
        <Scripts />
      </body>
    </html>
  )
}
