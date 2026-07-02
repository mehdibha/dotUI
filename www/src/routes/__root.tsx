/// <reference types="vite/client" />

import { lazy, Suspense } from 'react'
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ThemeProvider } from 'starter-themes'

import { siteConfig } from '@/config/site'
import { truncateOnWord } from '@/lib/text'
import { ToastProvider } from '@/registry/ui/toast'

import appCss from '@/styles.css?url'

// Dev-only floating panel for live design/layout exploration (see src/dev/tweaker).
const DevTweaker = import.meta.env.DEV
  ? lazy(() => import('@/dev/tweaker').then((m) => ({ default: m.DevTweaker })))
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
        {/* Reload-at-scroll flash fix. The router runs `scrollRestoration:
            true`, restoring scroll from JS. Our pages are server-rendered, so on
            a heavy page the browser paints the content at the top *before* the
            scroll is restored (this is true of the browser's own native restore
            too — it can't reach the saved offset until the document is tall
            enough, which is after first paint). A reload partway down then
            flashes at the top and jumps. Fix: when — and only when — we're
            reloading at a saved non-zero scroll, hide the document until the
            scroll has actually landed, so the first paint the user sees is
            already at the right place. First visits and reloads at the top read
            no saved offset, so they never hide and pay no cost. Reads the
            router's scroll cache; if its shape ever changes this no-ops back to
            the previous behavior. */}
        <script
          // oxlint-disable-next-line react/no-danger -- static, hardcoded inline script (no user input)
          dangerouslySetInnerHTML={{
            __html: `(function(){try{history.scrollRestoration="auto";var c=JSON.parse(sessionStorage.getItem("tsr-scroll-restoration-v1_3")||"{}");var k=(history.state&&history.state.__TSR_key)||location.href;var w=c[k]&&c[k].window;var y=w&&w.scrollY;if(!(y>0))return;var e=document.documentElement;e.style.visibility="hidden";var shown=false;function show(){if(shown)return;shown=true;e.style.visibility="";removeEventListener("scroll",chk,true)}function chk(){if(window.scrollY>=y-4)show()}addEventListener("scroll",chk,true);setTimeout(show,1500);function loop(){chk();if(!shown)requestAnimationFrame(loop)}requestAnimationFrame(loop)}catch(_){}})()`,
          }}
        />
        {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" /> */}
        <HeadContent />
      </head>
      <body className="min-h-screen bg-bg font-sans text-fg antialiased">
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  )
}
