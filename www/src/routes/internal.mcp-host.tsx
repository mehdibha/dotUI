import { createFileRoute } from "@tanstack/react-router"

import { DevHost } from "@/modules/mcp/dev-host"

export const Route = createFileRoute("/internal/mcp-host")({
  ssr: false,
  component: import.meta.env.DEV ? DevHost : undefined,
  head: import.meta.env.DEV
    ? () => ({ meta: [{ title: "MCP App dev host · dotUI" }] })
    : undefined,
})
