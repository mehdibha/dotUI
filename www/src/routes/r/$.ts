import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/r/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const [{ serveRegistry }, { getSnapshotStore }] = await Promise.all([
          import("@/lib/registry/serve"),
          import("@/lib/snapshots/store"),
        ])
        return serveRegistry(request, getSnapshotStore())
      },
    },
  },
})
