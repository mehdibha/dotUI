import { createFileRoute, notFound } from "@tanstack/react-router"

import { DRAFTS } from "@/modules/panel-lab/drafts"
import { PanelDraftPage } from "@/modules/panel-lab/version-page"

export const Route = createFileRoute("/internal/panel-lab/draft/$draft")({
  loader: ({ params }) => {
    const draft = DRAFTS.find((d) => d.id === params.draft)
    if (!draft) throw notFound()
    return { pr: draft.pr, title: draft.title }
  },
  component: RouteComponent,
  head: ({ loaderData }) => ({
    meta: [{ title: `Draft #${loaderData?.pr ?? ""} · dotUI` }],
  }),
})

function RouteComponent() {
  const { draft: id } = Route.useParams()
  const draft = DRAFTS.find((d) => d.id === id)
  if (!draft) return null
  return <PanelDraftPage draft={draft} />
}
