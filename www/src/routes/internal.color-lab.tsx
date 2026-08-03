import { createFileRoute } from "@tanstack/react-router"

import { ColorLab } from "@/modules/color-lab/page"

export const Route = createFileRoute("/internal/color-lab")({
  component: ColorLab,
  head: () => ({ meta: [{ title: "Color Lab · dotUI" }] }),
})
