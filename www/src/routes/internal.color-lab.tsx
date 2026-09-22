import { createFileRoute } from "@tanstack/react-router"

import { ColorLab } from "@/modules/color-lab/page"

export const Route = createFileRoute("/internal/color-lab")({
  component: import.meta.env.DEV ? ColorLab : undefined,
  head: import.meta.env.DEV
    ? () => ({ meta: [{ title: "Color Lab · dotUI" }] })
    : undefined,
})
