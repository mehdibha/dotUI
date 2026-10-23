import { createFileRoute, notFound } from "@tanstack/react-router"

import { INTERNAL_PAGES } from "@/modules/internal/enabled"

// Children gate component/head too, so a dotui.org build drops the lab pages.
export const Route = createFileRoute("/internal")({
  beforeLoad: () => {
    if (!INTERNAL_PAGES) throw notFound()
  },
})
