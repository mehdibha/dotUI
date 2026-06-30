import { createRouter } from '@tanstack/react-router'

import { DefaultError } from '@/components/default-error'
import { NotFound } from '@/components/not-found'

import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: DefaultError,
  })

  // Don't reset scroll on the initial client render. With `scrollRestoration`,
  // the router fires a post-hydration `onRendered` that — finding no cached
  // position for a fresh visit — calls `window.scrollTo(0, 0)`. On a heavy page
  // (the landing showcase hydrates ~1k nodes) the user can scroll during the
  // hydration gap, and that late reset then snaps them back to the top. The SSR
  // inline script already restored the correct position before paint, so this
  // first reset is redundant. `resetNextScroll` flips back to `true` after that
  // one render, so link navigations (scroll to top) and back/forward (restore
  // cached position) are unaffected.
  if (typeof window !== 'undefined') {
    router.resetNextScroll = false
  }

  return router
}
