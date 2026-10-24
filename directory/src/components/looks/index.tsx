import type { LooksFile } from "~/data/looks"

import { ComponentsSection } from "./components"
import {
  ColorSection,
  CoverageSection,
  ElevationSection,
  GapsSection,
  PagesSection,
  ShapeSection,
  SpacingSection,
  TypeSection,
} from "./sections"

/* A captured system on one page: what the capture read, section by section,
   with the gaps left visible. */

const SECTIONS = [
  { id: "coverage", label: "Coverage", Component: CoverageSection },
  { id: "color", label: "Color", Component: ColorSection },
  { id: "type", label: "Type", Component: TypeSection },
  { id: "shape", label: "Shape", Component: ShapeSection },
  { id: "spacing", label: "Spacing", Component: SpacingSection },
  { id: "elevation", label: "Elevation", Component: ElevationSection },
  { id: "components", label: "Components", Component: ComponentsSection },
  { id: "gaps", label: "Gaps", Component: GapsSection },
  { id: "pages", label: "Pages read", Component: PagesSection },
]

export const LOOKS_SECTIONS = SECTIONS.map(({ id, label }) => ({ id, label }))

export function LooksExplorer({ looks }: { looks: LooksFile }) {
  return (
    <div className="flex flex-col gap-20 px-6 pt-16 pb-28">
      {SECTIONS.map(({ id, Component }) => (
        <section key={id} id={id} className="scroll-mt-24">
          <Component looks={looks} />
        </section>
      ))}
    </div>
  )
}
