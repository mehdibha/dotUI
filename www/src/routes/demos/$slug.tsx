import { createFileRoute } from "@tanstack/react-router"

import { DemoPage } from "./-demo-page"

export const Route = createFileRoute("/demos/$slug")({
  component: DemoPage,
})
