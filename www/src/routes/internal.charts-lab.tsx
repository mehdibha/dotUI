import { lazy, Suspense } from "react"
import { createFileRoute } from "@tanstack/react-router"

const ChartsLab = lazy(() =>
  import("@/modules/charts-lab/page").then((m) => ({ default: m.ChartsLab })),
)

export const Route = createFileRoute("/internal/charts-lab")({
  component: RouteComponent,
  head: () => ({ meta: [{ title: "Charts Lab · dotUI" }] }),
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <ChartsLab />
    </Suspense>
  )
}
