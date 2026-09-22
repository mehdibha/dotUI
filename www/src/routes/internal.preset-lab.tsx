import { createFileRoute } from "@tanstack/react-router"

import { PresetLab } from "@/modules/preset-lab/page"

export const Route = createFileRoute("/internal/preset-lab")({
  component: import.meta.env.DEV ? PresetLab : undefined,
  head: () => ({ meta: [{ title: "Preset Lab · dotUI" }] }),
})
