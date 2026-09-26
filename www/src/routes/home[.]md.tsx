import { createFileRoute } from "@tanstack/react-router"

import { HOME_MD } from "@/config/home-md"

// Linked from the homepage <head> as the markdown alternate for AI agents.
export const Route = createFileRoute("/home.md")({
  server: {
    handlers: {
      GET: () =>
        new Response(HOME_MD, {
          headers: { "Content-Type": "text/markdown; charset=utf-8" },
        }),
    },
  },
})
