import { createFileRoute } from "@tanstack/react-router"

import { PanelLabGallery } from "@/modules/panel-lab/gallery"

export const Route = createFileRoute("/internal/panel-lab/")({
  component: PanelLabGallery,
  head: () => ({ meta: [{ title: "Panel Lab · dotUI" }] }),
})
