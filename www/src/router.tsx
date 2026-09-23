import { createRouter, defaultStringifySearch } from "@tanstack/react-router"

import { DefaultError } from "@/components/default-error"
import { NotFound } from "@/components/not-found"

import { routeTree } from "./routeTree.gen"

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    // `@` is valid in a query: keep /studio?preset=linear@2 readable.
    stringifySearch: (search) =>
      defaultStringifySearch(search).replaceAll("%40", "@"),
    defaultNotFoundComponent: NotFound,
    defaultErrorComponent: DefaultError,
  })

  return router
}
