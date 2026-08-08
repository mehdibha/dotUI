import { createFileRoute } from "@tanstack/react-router"

import { PanelLabPage } from "@/modules/panel-lab/page"

export const Route = createFileRoute("/internal/panel-lab/")({
  component: PanelLabPage,
  head: () => ({ meta: [{ title: "Panel Lab · dotUI" }] }),
})
