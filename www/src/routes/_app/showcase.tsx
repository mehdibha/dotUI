import { createFileRoute } from "@tanstack/react-router"

import { siteConfig } from "@/config/site"
import { ShowcasePage } from "@/modules/showcase/page"

export const Route = createFileRoute("/_app/showcase")({
  head: () => {
    const title = `Showcase · ${siteConfig.name}`
    const description =
      "dotUI on a phone: menus, selects, date and color pickers open as bottom sheets, sheets snap and stack, and touch density sizes every control for thumbs."
    const url = `${siteConfig.url}/showcase`

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:url", content: url },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
    }
  },
  component: ShowcasePage,
})
