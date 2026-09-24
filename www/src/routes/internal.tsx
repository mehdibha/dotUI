import { createFileRoute, notFound } from "@tanstack/react-router"

// Dev-only labs; children gate component/head too, so prod drops the lab pages.
export const Route = createFileRoute("/internal")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound()
  },
})
