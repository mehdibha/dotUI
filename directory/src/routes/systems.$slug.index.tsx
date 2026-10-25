import { createFileRoute } from "@tanstack/react-router"

import { getTabs } from "~/components/system/registry"
import { SystemTabPanel } from "~/components/system/tab"

export const Route = createFileRoute("/systems/$slug/")({
  component: function FirstTab() {
    const { slug } = Route.useParams()
    return <SystemTabPanel tab={getTabs(slug)[0]!} />
  },
})
