import { createFileRoute } from "@tanstack/react-router"

import { ColorLab } from "@/modules/color-lab/page"
import { INTERNAL_PAGES } from "@/modules/internal/enabled"

export const Route = createFileRoute("/internal/color-lab")({
  component: INTERNAL_PAGES ? ColorLab : undefined,
  head: INTERNAL_PAGES
    ? () => ({ meta: [{ title: "Color Lab · dotUI" }] })
    : undefined,
})
