import { createFileRoute } from "@tanstack/react-router"

import { Showcase } from "@/components/showcase"

export const Route = createFileRoute("/")({
  component: () => <Showcase framework="TanStack Start" preset="Origin" />,
})
