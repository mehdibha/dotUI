/**
 * POST /mcp — dotUI's remote MCP server (streamable HTTP, stateless). Agents
 * list the studio's axes, set them, preview the result and export it. The
 * server module loads lazily to stay out of the eager route graph.
 */

import { createFileRoute } from "@tanstack/react-router"

// Stateless: no server-initiated stream (GET) and no session to end (DELETE).
const notAllowed = () =>
  new Response(null, { status: 405, headers: { Allow: "POST" } })

export const Route = createFileRoute("/mcp")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { handleMcpRequest } = await import("@/modules/mcp/server")
        return handleMcpRequest(request)
      },
      GET: notAllowed,
      DELETE: notAllowed,
    },
  },
})
