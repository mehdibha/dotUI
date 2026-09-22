import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/internal")({
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound()
  },
})
