import { createFileRoute, redirect } from "@tanstack/react-router"
import type { SearchSchemaInput } from "@tanstack/react-router"

// The editor moved from /create to /studio. Keep this path as a permanent
// redirect — forwarding the search as-is (no defaults, so the first response
// is the 301) — so bookmarks and ?s= / ?preset= links keep working.
export const Route = createFileRoute("/_app/create")({
  validateSearch: (
    search: {
      panel?: string
      preview?: string
      gallery?: boolean
      s?: string
      preset?: string
    } & SearchSchemaInput,
  ) => search,
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/studio",
      search,
      statusCode: 301,
    })
  },
})
