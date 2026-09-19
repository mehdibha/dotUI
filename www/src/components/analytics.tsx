import { useRouterState } from "@tanstack/react-router"
import { Analytics } from "@vercel/analytics/react"
import type { BeforeSendEvent } from "@vercel/analytics/react"

// The studio serializes a whole design system into ?preset=, so every visit
// would otherwise land in the dashboard as its own multi-KB path. Collapse it
// to one value — enough to count arrivals from a shared link.
function beforeSend(event: BeforeSendEvent) {
  const url = new URL(event.url)
  if (!url.searchParams.has("preset")) return event

  url.searchParams.set("preset", "shared")
  return { ...event, url: url.toString() }
}

export function VercelAnalytics() {
  // Passing `route` turns the script's own auto-tracking off, so pageviews are
  // reported per router navigation: the matched route (`/docs/$`) groups the
  // path it resolved to.
  const path = useRouterState({ select: (s) => s.location.pathname })
  const route = useRouterState({
    select: (s) => s.matches.at(-1)?.fullPath ?? s.location.pathname,
  })

  return <Analytics route={route} path={path} beforeSend={beforeSend} />
}
