import { createFileRoute } from "@tanstack/react-router"

import { homeMarkdown } from "@/config/home-md"

// Serves /home.md — a concise markdown view of the homepage for AI agents,
// linked from the page <head> as <link rel="alternate" type="text/markdown">.
//
// NOTE: on Vercel this route is shadowed by a static /home.md written at build
// time by scripts/patch-vercel-config.ts (the filesystem layer serves it before
// this function), which is also what the "/" + Accept:text/markdown negotiation
// resolves to. This route is the live source only on the node preset / local
// dev. Both read the same body from src/config/home-md.ts.

export const Route = createFileRoute("/home.md")({
  server: {
    handlers: {
      GET: () =>
        new Response(homeMarkdown, {
          headers: { "Content-Type": "text/markdown; charset=utf-8" },
        }),
    },
  },
})
