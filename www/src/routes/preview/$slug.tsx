import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"

import { PreviewPage } from "./-preview-page"

export const Route = createFileRoute("/preview/$slug")({
  validateSearch: z.object({
    preset: z.string().optional().catch(undefined),
    // Initial display mode, baked in by the /create parent (read directly from
    // location by usePreviewForcedTheme; declared so the router keeps it).
    mode: z.enum(["light", "dark"]).optional().catch(undefined),
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
