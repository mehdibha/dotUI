import { createFileRoute } from "@tanstack/react-router"

import { CompositionAnimation } from "@/modules/internal/composition-animation"
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
      description="The code-to-preview composition loop that used to run on the landing page: magic-move code diffs synced with view-transitioned component previews."
    >
      <CompositionAnimation className="max-w-4xl" />
    </InternalShell>
  )
}
