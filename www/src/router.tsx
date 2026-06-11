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

  return router
}
