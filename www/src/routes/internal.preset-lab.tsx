import { createFileRoute } from "@tanstack/react-router"

import { PresetLab } from "@/modules/preset-lab/page"

export const Route = createFileRoute("/internal/preset-lab")({
  component: PresetLab,
  head: () => ({ meta: [{ title: "Preset Lab · dotUI" }] }),
})
