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
  beforeLoad: ({ params }) => {
    // Warm the example chunk without pulling the examples barrel into the
    // router's critical import graph.
    void import("./-preview-page").then(({ getExamplesPromise }) =>
      getExamplesPromise(params.slug),
    )
  },
  component: PreviewPage,
})
