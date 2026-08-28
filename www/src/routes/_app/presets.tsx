import { createFileRoute, redirect } from "@tanstack/react-router"

// The preset gallery moved into the editor (a modal on /studio). Keep this path
// as a permanent redirect so existing links and bookmarks don't break.
export const Route = createFileRoute("/_app/presets")({
  beforeLoad: () => {
    throw redirect({
      to: "/studio",
      search: { gallery: true },
      statusCode: 301,
    })
  },
})
