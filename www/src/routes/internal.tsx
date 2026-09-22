import { createFileRoute, notFound } from "@tanstack/react-router"

// Labs are dev-only: production answers every /internal/* with the 404 page.
// Child routes set `component: import.meta.env.DEV ? Page : undefined` so the
// lab code also drops out of the production client chunks.
export const Route = createFileRoute("/internal")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound()
  },
})
