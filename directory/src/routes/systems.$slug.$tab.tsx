import { createFileRoute, notFound } from "@tanstack/react-router"

import { getTabs } from "~/components/system/registry"
import type { SystemTab } from "~/components/system/registry"
import { SystemTabPanel } from "~/components/system/tab"

export const Route = createFileRoute("/systems/$slug/$tab")({
  params: {
    parse: ({ tab }) => ({ tab: tab as SystemTab }),
  },
  beforeLoad: ({ params }) => {
    if (!getTabs(params.slug).includes(params.tab)) throw notFound()
  },
  component: function OtherTab() {
    const { tab } = Route.useParams()
    return <SystemTabPanel tab={tab} />
  },
})
