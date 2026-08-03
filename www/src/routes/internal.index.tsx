import { createFileRoute } from "@tanstack/react-router"

import { InternalIndex } from "@/modules/internal/page"

export const Route = createFileRoute("/internal/")({
  component: InternalIndex,
  head: () => ({ meta: [{ title: "Internal · dotUI" }] }),
})
