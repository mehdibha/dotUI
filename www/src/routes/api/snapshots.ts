import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/api/snapshots")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const [{ createSnapshot }, { getSnapshotStore }] = await Promise.all([
          import("@/lib/snapshots/handlers"),
          import("@/lib/snapshots/store"),
        ])
        return createSnapshot(request, getSnapshotStore())
      },
    },
  },
})
