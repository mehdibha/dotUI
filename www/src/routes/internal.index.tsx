import { createFileRoute } from "@tanstack/react-router"

import { InternalIndex } from "@/modules/internal/page"

export const Route = createFileRoute("/internal/")({
  component: import.meta.env.DEV ? InternalIndex : undefined,
  head: () => ({ meta: [{ title: "Internal · dotUI" }] }),
})
