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
import { GitHubIcon } from '@/components/icons/github'
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
        <header>
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-3.5">
            <Link to="/" className="flex items-baseline gap-3">
              <span className="text-lg font-semibold tracking-tight">
                ds.<span className="text-fg-muted">directory</span>
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-sm text-fg-muted">
              <LinkButton
                href="https://github.com/mehdibha/dotUI/tree/main/ds"
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
        <footer className="flex items-center justify-center py-10">
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
