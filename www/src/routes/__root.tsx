/// <reference types="vite/client" />

import { lazy, Suspense } from 'react'
import {
  ClientOnly,
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { ThemeProvider } from 'starter-themes'

import { siteConfig } from '@/config/site'
import { truncateOnWord } from '@/lib/text'
import { ToastProvider } from '@/registry/ui/toast'

import appCss from '@/styles.css?url'

// Floating panel for live design/layout exploration (see src/dev/tweaker).
// Dev + Vercel previews; the !SSR guard keeps the chunk out of the server
// bundle so build-time prerendering never evaluates it.
const DevTweaker =
  !import.meta.env.SSR &&
  (import.meta.env.DEV || import.meta.env.VERCEL_ENV === 'preview')
    ? lazy(() =>
        import('@/dev/tweaker').then((m) => ({ default: m.DevTweaker })),
      )
    : null

// Router devtools: shown in dev and on Vercel previews, stripped from production.
// The !SSR guard keeps the chunk out of the server bundle entirely — it touches
// `window` at module scope, which crashes build-time prerendering.
const RouterDevtools =
  !import.meta.env.SSR &&
  (import.meta.env.DEV || import.meta.env.VERCEL_ENV === 'preview')
    ? lazy(() =>
        import('@tanstack/react-router-devtools').then((m) => ({
          default: m.TanStackRouterDevtoolsInProd,
        })),
      )
    : null

export const Route = createRootRoute({
  head: () => {
    const title = `${siteConfig.title} - ${siteConfig.description}`
    const description = truncateOnWord(siteConfig.description, 148, true)
    const ogImageUrl = `${siteConfig.url}/og?title=${encodeURIComponent(siteConfig.og.title)}&description=${encodeURIComponent(siteConfig.og.description)}`

    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { title },
        { name: 'description', content: description },
        { name: 'keywords', content: siteConfig.keywords.join(', ') },
        { name: 'author', content: siteConfig.creator },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:url', content: siteConfig.url },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:site_name', content: siteConfig.name },
        { property: 'og:image', content: ogImageUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: ogImageUrl },
        { name: 'twitter:creator', content: siteConfig.twitter.creator },
      ],
      links: [
        { rel: 'stylesheet', href: appCss },
        {
          rel: 'alternate icon',
          type: 'image/png',
          href: '/favicon-96x96.png',
          sizes: '96x96',
        },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
          sizes: '180x180',
        },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
    }
  },
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider>
      <RootDocument>
        <ToastProvider>
          <Outlet />
        </ToastProvider>
        {DevTweaker && (
          <Suspense fallback={null}>
            <DevTweaker />
          </Suspense>
        )}
      </RootDocument>
    </ThemeProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" /> */}
        <HeadContent />
      </head>
      <body className="min-h-screen bg-bg font-sans text-fg antialiased">
        {children}
        {/* ClientOnly: the devtools touch `window` at module scope, which
            crashes build-time prerendering when previews include them. */}
        {RouterDevtools && (
          <ClientOnly fallback={null}>
            <Suspense fallback={null}>
              <RouterDevtools position="bottom-right" />
            </Suspense>
          </ClientOnly>
        )}
        <Scripts />
      </body>
    </html>
  )
}
