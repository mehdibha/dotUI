/// <reference types="vite/client" />

import { lazy, Suspense } from 'react'
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { ThemeProvider } from 'starter-themes'

import { siteConfig } from '@/config/site'
import { truncateOnWord } from '@/lib/text'
import { ToastProvider } from '@/registry/ui/toast'
import { useTweak } from '@/dev/tweaker'

import appCss from '@/styles.css?url'

// Dev-only floating panel for live design/layout exploration (see src/dev/tweaker).
const DevTweaker = import.meta.env.DEV
  ? lazy(() => import('@/dev/tweaker').then((m) => ({ default: m.DevTweaker })))
  : null

// Tweaker A/B for the proposed button icon-text gap bump: default/sm,
// comfortable/xs+sm go 4px → 6px (also catches compact md/lg — same h-7/h-8
// gap-1 signature — but the site runs default density).
function ButtonGapTweak() {
  const suggested = useTweak('Icon gap 4px → 6px', {
    type: 'boolean',
    default: false,
    group: 'Button',
  })
  if (!suggested) return null
  return <style>{`[data-button].gap-1:is(.h-7,.h-8){gap:0.375rem}`}</style>
}

// Router devtools: shown in dev and on Vercel previews, stripped from production.
const RouterDevtools =
  import.meta.env.DEV || import.meta.env.VERCEL_ENV === 'preview'
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
            <ButtonGapTweak />
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
        {RouterDevtools && (
          <Suspense fallback={null}>
            <RouterDevtools position="bottom-right" />
          </Suspense>
        )}
        <Scripts />
      </body>
    </html>
  )
}
