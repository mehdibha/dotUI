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
