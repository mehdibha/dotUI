import { createFileRoute } from "@tanstack/react-router"

import { Cover } from "@/modules/marketing/cover"

export const Route = createFileRoute("/internal/cover")({
  ssr: false,
  component: import.meta.env.DEV ? Cover : undefined,
  head: import.meta.env.DEV
    ? () => ({ meta: [{ title: "Cover · dotUI" }] })
    : undefined,
})
