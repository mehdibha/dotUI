import { createFileRoute } from "@tanstack/react-router"

import { INTERNAL_PAGES } from "@/modules/internal/enabled"
import { Cover } from "@/modules/marketing/cover"

export const Route = createFileRoute("/internal/cover")({
  ssr: false,
  component: INTERNAL_PAGES ? Cover : undefined,
  head: INTERNAL_PAGES
    ? () => ({ meta: [{ title: "Cover · dotUI" }] })
    : undefined,
})
