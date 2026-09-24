import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/api/snapshots/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const [{ readSnapshot }, { getSnapshotStore }] = await Promise.all([
          import("@/lib/snapshots/handlers"),
          import("@/lib/snapshots/store"),
        ])
        return readSnapshot(params.id, getSnapshotStore())
      },
    },
  },
})
