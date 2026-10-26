import { getRouteApi } from "@tanstack/react-router"

import { LooksTabPanel } from "~/components/looks"
import { BlocksTabPanel } from "~/components/looks/blocks"

import { SystemExplorer } from "."
import type { SystemTab } from "./registry"

const route = getRouteApi("/systems/$slug")

/** One tab of a system's page, from the data its page loaded. */
export function SystemTabPanel({ tab }: { tab: SystemTab }) {
  const { catalogEntry, system, looks, spec, docs, blocks } =
    route.useLoaderData()
  if (tab === "live")
    return (
      system && <SystemExplorer system={system} catalogEntry={catalogEntry} />
    )
  if (tab === "blocks")
    return blocks && <BlocksTabPanel blocks={blocks} docs={docs} spec={spec} />
  return (
    looks && <LooksTabPanel looks={looks} spec={spec} docs={docs} tab={tab} />
  )
}
