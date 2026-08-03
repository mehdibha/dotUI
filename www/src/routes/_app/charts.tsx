import { createFileRoute, redirect } from "@tanstack/react-router"

// The charts gallery moved into the docs at /docs/charts. Keep this path as a
// permanent redirect so existing links and bookmarks don't break.
export const Route = createFileRoute("/_app/charts")({
  beforeLoad: () => {
    throw redirect({
      to: "/docs/$",
      params: { _splat: "charts" },
      statusCode: 301,
    })
  },
})
