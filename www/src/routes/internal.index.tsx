import { createFileRoute } from "@tanstack/react-router"

import { INTERNAL_PAGES } from "@/modules/internal/enabled"
import { InternalIndex } from "@/modules/internal/page"

export const Route = createFileRoute("/internal/")({
  component: INTERNAL_PAGES ? InternalIndex : undefined,
  head: INTERNAL_PAGES
    ? () => ({ meta: [{ title: "Internal · dotUI" }] })
    : undefined,
})
