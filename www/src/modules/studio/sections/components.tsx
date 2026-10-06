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
    owners: ["buttons", "button-groups", "toggles", "segmented-control"],
    label: "Buttons",
    Preview: ButtonsPreview,
    Body: ButtonsSection,
  },
  {
    id: "inputs",
    owners: ["inputs", "input-groups", "number-field", "otp-field"],
    label: "Inputs",
    Preview: InputsPreview,
    Body: InputsSection,
  },
  {
    id: "selection-controls",
    owners: ["checkbox", "radio", "switch", "choice-cards"],
    label: "Selection controls",
    Preview: SelectionControlsPreview,
    Body: SelectionControlsSection,
  },
  {
    id: "pickers",
    owners: ["pickers", "calendar"],
    label: "Pickers",
    Preview: PickersPreview,
    Body: PickersSection,
  },
  {
    id: "sliders",
    label: "Sliders",
    Preview: SlidersPreview,
    Body: SlidersSection,
  },
  {
    id: "menus",
    label: "Menus",
    Preview: MenusPreview,
    Body: MenusSection,
  },
  {
    id: "dialogs",
    label: "Dialogs",
    Preview: DialogsPreview,
    Body: DialogsSection,
  },
  {
    id: "popovers",
    owners: ["popovers", "tooltips"],
    label: "Popovers",
    Preview: PopoversPreview,
    Body: PopoversSection,
  },
  {
    id: "navigation",
    owners: ["tabs", "links", "breadcrumbs", "pagination", "sidebar"],
    label: "Navigation",
    Preview: NavigationPreview,
    Body: NavigationSection,
  },
  {
    id: "loading",
    owners: ["spinner", "skeleton", "progress"],
    label: "Loading",
    Body: LoadingSection,
  },
  {
    id: "badges",
    owners: ["badges", "kbd"],
    label: "Badges",
    Preview: BadgesPreview,
    Body: BadgesSection,
  },
  {
    id: "avatars",
    label: "Avatars",
    Preview: AvatarsPreview,
    Body: AvatarsSection,
  },
  {
    id: "tables",
    label: "Tables",
    Preview: TablesPreview,
    Body: TablesSection,
  },
  {
    id: "accordion",
    label: "Accordion",
    Preview: AccordionPreview,
    Body: AccordionSection,
  },
  {
    id: "charts",
    label: "Charts",
    Preview: ChartsPreview,
    Body: ChartsSection,
  },
]

export function ComponentsSection({ studio }: { studio: Studio }) {
  const { effective } = studio
  const open = useContext(PanelNav)
  return (
    <>
      {COMPONENT_PAGES.map(({ id, label, Preview }) => (
        <DialLink
          key={id}
          label={label}
          onPress={() => open(id)}
          value={Preview && <Preview state={effective} />}
        />
      ))}
    </>
  )
}
