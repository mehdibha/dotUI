"use client"

/* Components — one row per family, each opening the family's page in place
   of the panel. The row carries the family's specimen; the page holds every
   option, so a new one never adds a row here. */

import { useContext } from "react"

import { DialLink } from "../dial"
import { PanelNav } from "../rows"
import type { ChapterPage, Studio } from "../state"
import { AccordionPreview, AccordionSection } from "./accordion"
import { AvatarsPreview, AvatarsSection } from "./avatars"
import { BadgesPreview, BadgesSection } from "./badges"
import { ButtonsPreview, ButtonsSection } from "./buttons"
import { ChartsPreview, ChartsSection } from "./charts"
import { DialogsPreview, DialogsSection } from "./dialogs"
import { InputsPreview, InputsSection } from "./inputs"
import { LoadingSection } from "./loading"
import { MenusPreview, MenusSection } from "./menus"
import { NavigationPreview, NavigationSection } from "./navigation"
import { PickersPreview, PickersSection } from "./pickers"
import { PopoversPreview, PopoversSection } from "./popovers"
import {
  SelectionControlsPreview,
  SelectionControlsSection,
} from "./selection-controls"
import { SlidersPreview, SlidersSection } from "./sliders"
import { TablesPreview, TablesSection } from "./tables"

export const COMPONENT_PAGES: ChapterPage[] = [
  {
    id: "buttons",
    label: "Buttons",
    Preview: ButtonsPreview,
    Body: ButtonsSection,
    components: [
      "button",
      "toggle-button",
      "toggle-button-group",
      "group",
      "segmented-control",
    ],
  },
  {
    id: "inputs",
    label: "Inputs",
    Preview: InputsPreview,
    Body: InputsSection,
    components: ["input", "number-field", "otp-field"],
  },
  {
    id: "selection-controls",
    label: "Selection controls",
    Preview: SelectionControlsPreview,
    Body: SelectionControlsSection,
    components: ["checkbox", "radio-group", "switch"],
  },
  {
    id: "pickers",
    label: "Pickers",
    Preview: PickersPreview,
    Body: PickersSection,
    components: ["select", "calendar"],
  },
  {
    id: "sliders",
    label: "Sliders",
    Preview: SlidersPreview,
    Body: SlidersSection,
    components: ["slider"],
  },
  {
    id: "menus",
    label: "Menus",
    Preview: MenusPreview,
    Body: MenusSection,
    components: ["menu", "list-box", "command"],
  },
  {
    id: "dialogs",
    label: "Dialogs",
    Preview: DialogsPreview,
    Body: DialogsSection,
    components: ["dialog", "modal", "drawer"],
  },
  {
    id: "popovers",
    label: "Popovers",
    Preview: PopoversPreview,
    Body: PopoversSection,
    components: ["popover", "tooltip"],
  },
  {
    id: "navigation",
    label: "Navigation",
    Preview: NavigationPreview,
    Body: NavigationSection,
    components: ["tabs", "link", "breadcrumbs", "pagination"],
  },
  {
    id: "loading",
    label: "Loading",
    Body: LoadingSection,
    components: ["loader", "skeleton", "progress-bar"],
  },
  {
    id: "badges",
    label: "Badges",
    Preview: BadgesPreview,
    Body: BadgesSection,
    components: ["badge", "tag-group", "kbd"],
  },
  {
    id: "avatars",
    label: "Avatars",
    Preview: AvatarsPreview,
    Body: AvatarsSection,
    components: ["avatar"],
  },
  {
    id: "tables",
    label: "Tables",
    Preview: TablesPreview,
    Body: TablesSection,
    components: ["table"],
  },
  {
    id: "accordion",
    label: "Accordion",
    Preview: AccordionPreview,
    Body: AccordionSection,
    components: ["accordion", "collapsible"],
  },
  {
    id: "charts",
    label: "Charts",
    Preview: ChartsPreview,
    Body: ChartsSection,
    components: ["chart"],
  },
]

export function ComponentsSection({ studio }: { studio: Studio }) {
  const { state } = studio
  const open = useContext(PanelNav)
  return (
    <>
      {COMPONENT_PAGES.map(({ id, label, Preview }) => (
        <DialLink
          key={id}
          label={label}
          onPress={() => open(id)}
          value={Preview && <Preview state={state} />}
        />
      ))}
    </>
  )
}
