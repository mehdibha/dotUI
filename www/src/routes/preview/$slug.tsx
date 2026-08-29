import { createFileRoute } from "@tanstack/react-router"

import { PreviewPage } from "./-preview-page"

export const Route = createFileRoute("/preview/$slug")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { preset?: string; mode?: "light" | "dark" } => ({
    preset: typeof search.preset === "string" ? search.preset : undefined,
    // Initial display mode, baked in by the /create parent (read directly from
    // location by usePreviewForcedTheme; declared so the router keeps it).
    mode:
      search.mode === "light" || search.mode === "dark"
        ? search.mode
        : undefined,
  }),
  ssr: false,
  loader: async ({ params }) => {
    // The example chunk must resolve here, not in the component: while a
    // loader pends the router keeps the previous preview on screen, whereas a
    // component that suspends blanks the page (there is no boundary above it —
    // and no transition can hold it, since router state updates flow through
    // useSyncExternalStore and render synchronously). The dynamic import keeps
    // the examples barrel out of the router's critical import graph.
    const { getExamplesPromise } = await import("./-preview-page")
    const mod = await getExamplesPromise(params.slug)
    return { Examples: mod?.default ?? null }
  },
  component: PreviewPage,
})
