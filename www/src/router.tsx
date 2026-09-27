import { createRouter } from "@tanstack/react-router"

import { trackTraversal } from "@/lib/history-traversal"
import { DefaultError } from "@/components/default-error"
import { NotFound } from "@/components/not-found"

import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: DefaultError,
  })
  trackTraversal(router.history)

  return router
}
