import { createFileRoute } from "@tanstack/react-router"

import { CompositionSection } from "@/modules/internal/composition-section"
import { InternalShell } from "@/modules/internal/shell"

export const Route = createFileRoute("/internal/composition")({
  component: CompositionPage,
  head: () => ({ meta: [{ title: "Composition · Internal · dotUI" }] }),
})

function CompositionPage() {
  return (
    <InternalShell
      crumbs={[{ label: "Composition section" }]}
      title="Composition section"
      description="The composition section built for the landing page: the step loop that walks a field from its parts up to a full pattern, code and rendered result in sync."
    >
      <div className="max-w-6xl">
        <CompositionSection />
      </div>
    </InternalShell>
  )
}
