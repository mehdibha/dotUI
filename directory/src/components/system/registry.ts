import type { ComponentType } from "react"

import { LOOKS_TABS } from "~/components/looks"
import { dataIndex } from "~/data"
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

export const TABS = {
  docs: "Docs",
  computed: "Computed",
  capture: "Capture",
  live: "Live",
}

export type SystemTab = keyof typeof TABS

/** A captured system opens on its docs; a live one only has its live tab. */
export function getTabs(slug: string): SystemTab[] {
  const tabs: SystemTab[] = []
  if (dataIndex.looks.some((looks) => looks.slug === slug))
    tabs.push("docs", "computed", "capture")
  if (dataIndex.systems.some((system) => system.slug === slug))
    tabs.push("live")
  return tabs
}

/** Flat id + label list of a tab's sections, for the TOC lines and dropdown. */
export function getSectionList(
  slug: string,
  tab: SystemTab,
): { id: string; label: string }[] {
  if (tab !== "live")
    return LOOKS_TABS[tab].map(({ id, label }) => ({ id, label }))
  const system = dataIndex.systems.find((s) => s.slug === slug)
  return [
    ...getSectionGroups(slug).flatMap((group) =>
      group.sections.map(({ id, label }) => ({ id, label })),
    ),
    ...(system?.components?.components.length
      ? [{ id: "live-components", label: "Components" }]
      : []),
  ]
}
