import type { ComponentType } from "react"

import type { DocsFile } from "~/data/docs"
import type { LooksFile } from "~/data/looks"
import type { SpecFile } from "~/data/spec"

import { ComponentsSection } from "./components"
import { DocsComponents, DocsFoundations } from "./docs"
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

/* A captured system's page, in three tabs: the docs written from it, the
   values the capture computed, and how far the capture went. */

export interface LooksData {
  looks: LooksFile
  /** Its components as variants × sizes grids, once a capture wrote one. */
  spec?: SpecFile
  /** Its written docs. */
  docs?: DocsFile
}

type LooksSection = {
  id: string
  label: string
  Component: ComponentType<LooksData>
}

export const LOOKS_TABS = {
  docs: [
    { id: "foundations", label: "Foundations", Component: DocsFoundations },
    { id: "docs-components", label: "Components", Component: DocsComponents },
  ],
  computed: [
    { id: "color", label: "Color", Component: ColorSection },
    { id: "type", label: "Type", Component: TypeSection },
    { id: "shape", label: "Shape", Component: ShapeSection },
    { id: "spacing", label: "Spacing", Component: SpacingSection },
    { id: "elevation", label: "Elevation", Component: ElevationSection },
    { id: "components", label: "Components", Component: ComponentsSection },
  ],
  capture: [
    { id: "coverage", label: "Coverage", Component: CoverageSection },
    { id: "gaps", label: "Gaps", Component: GapsSection },
    { id: "pages", label: "Pages read", Component: PagesSection },
  ],
} satisfies Record<string, LooksSection[]>

export type LooksTab = keyof typeof LOOKS_TABS

export function LooksTabPanel({ tab, ...data }: LooksData & { tab: LooksTab }) {
  return (
    <div className="flex flex-col gap-20 pt-12 pb-28">
      {LOOKS_TABS[tab].map(({ id, Component }) => (
        <section key={id} id={id} className="scroll-mt-24">
          <Component {...data} />
        </section>
      ))}
    </div>
  )
}
