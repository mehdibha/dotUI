import { createFileRoute } from "@tanstack/react-router"

import { GOOGLE_FONTS_PRECONNECT } from "@/lib/fonts"
import { HomePage } from "@/modules/marketing/home-page"

export const Route = createFileRoute("/_app/")({
  head: () => ({
    // Markdown alternate for AI agents (also served via Accept negotiation).
    links: [
      { rel: "alternate", type: "text/markdown", href: "/home.md" },
      // The preset switcher's labels and showcase fonts come from Google.
      ...GOOGLE_FONTS_PRECONNECT,
    ],
  }),
  component: HomePage,
})
