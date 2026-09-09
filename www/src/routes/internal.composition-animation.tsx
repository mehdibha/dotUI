import { createFileRoute } from "@tanstack/react-router"

import { CompositionSection } from "@/modules/internal/composition-section"
import { InternalShell } from "@/modules/internal/shell"

export const Route = createFileRoute("/internal/composition-animation")({
  component: CompositionAnimationDemo,
  head: () => ({ meta: [{ title: "Composition animation · dotUI" }] }),
})

function CompositionAnimationDemo() {
  return (
    <InternalShell
      crumbs={[{ label: "Composition animation" }]}
      title="Composition animation"
      description="The composition loop retired from the landing page: 30 magic-move code beats synced with view-transitioned component previews. Hover to pause, click a step to jump."
    >
      <div className="max-w-6xl">
        <CompositionSection />
      </div>
    </InternalShell>
  )
}
