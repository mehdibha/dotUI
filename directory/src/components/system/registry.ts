import type { ComponentType } from "react"

import type { CatalogEntry, SystemEntry } from "~/data/schema"

import { ColorSystemSection } from "./sections/shadcn/color-system"
import { ColorsSection } from "./sections/shadcn/colors"
import { UsageSection } from "./sections/shadcn/usage"

export type SectionComponent = ComponentType<{
  system: SystemEntry
  catalogEntry?: CatalogEntry
}>

export interface SectionDef {
  id: string
  label: string
  Component: SectionComponent
}

export interface SectionGroup {
  id: string
  label: string
  blurb: string
  sections: SectionDef[]
}

const SHADCN_UI_GROUPS: SectionGroup[] = [
  {
    id: "overview",
    label: "Sections",
    blurb: "",
    sections: [
      {
        id: "color-system",
        label: "Color system",
        Component: ColorSystemSection,
      },
      { id: "colors", label: "Colors", Component: ColorsSection },
      { id: "usage", label: "Usage", Component: UsageSection },
    ],
  },
]

const GROUPS_BY_SLUG: Record<string, SectionGroup[]> = {
  "shadcn-ui": SHADCN_UI_GROUPS,
}

export function getSectionGroups(slug: string): SectionGroup[] {
  return GROUPS_BY_SLUG[slug] ?? []
}

/** Flat id + label list of a system's sections, for the TOC lines and dropdown. */
export function getSectionList(slug: string): { id: string; label: string }[] {
  return getSectionGroups(slug).flatMap((group) =>
    group.sections.map(({ id, label }) => ({ id, label })),
  )
}
