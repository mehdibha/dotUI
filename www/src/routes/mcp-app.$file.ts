import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/mcp-app/$file")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { serveCardFile } = await import("@/modules/mcp/cards")
        return serveCardFile(params.file)
      },
    },
  },
})
