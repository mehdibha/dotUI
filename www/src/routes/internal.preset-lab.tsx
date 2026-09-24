import { createFileRoute } from "@tanstack/react-router"

import { PresetLab } from "@/modules/preset-lab/page"

export const Route = createFileRoute("/internal/preset-lab")({
  component: import.meta.env.DEV ? PresetLab : undefined,
  head: import.meta.env.DEV
    ? () => ({ meta: [{ title: "Preset Lab · dotUI" }] })
    : undefined,
})
