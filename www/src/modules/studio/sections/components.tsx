"use client"

/* Components — one row per family, opening its page. */

import { useContext } from "react"

import { DialLink } from "../dial"
import { PanelNav } from "../rows"
import type { ChapterPage, Studio } from "../state"
import { ButtonsPreview, ButtonsSection } from "./buttons"
import { ChartsPreview, ChartsSection } from "./charts"
import { DataDisplayPreview, DataDisplaySection } from "./data-display"
import { DatesPreview, DatesSection } from "./dates"
import { DialogsPreview, DialogsSection } from "./dialogs"
import { FeedbackPreview, FeedbackSection } from "./feedback"
import { InputsPreview, InputsSection } from "./inputs"
import { MenusPreview, MenusSection } from "./menus"
import { NavigationPreview, NavigationSection } from "./navigation"
import { SelectionPreview, SelectionSection } from "./selection"

export const COMPONENT_PAGES: ChapterPage[] = [
  {
    id: "buttons",
    owners: [
      "buttons",
      "button-groups",
      "toggles",
      "segmented-control",
      "pagination",
    ],
    label: "Buttons",
    Preview: ButtonsPreview,
    Body: ButtonsSection,
  },
  {
    id: "inputs",
    owners: ["inputs", "input-groups", "number-field", "otp-field", "pickers"],
    label: "Inputs",
    Preview: InputsPreview,
    Body: InputsSection,
  },
  {
    id: "selection",
    owners: ["checkbox", "radio", "switch", "choice-cards", "sliders"],
    label: "Selection",
    Preview: SelectionPreview,
    Body: SelectionSection,
  },
  {
    id: "menus",
    owners: ["menus", "tooltips"],
    label: "Menus & popovers",
    Preview: MenusPreview,
    Body: MenusSection,
  },
  {
    id: "dialogs",
    owners: ["dialogs", "mobileDialogs"],
    label: "Dialogs",
    Preview: DialogsPreview,
    Body: DialogsSection,
  },
  {
    id: "nav",
    owners: ["tabs", "links", "breadcrumbs"],
    label: "Navigation",
    Preview: NavigationPreview,
    Body: NavigationSection,
  },
  {
    id: "dates",
    owners: ["calendar"],
    label: "Date & time",
    Preview: DatesPreview,
    Body: DatesSection,
  },
  {
    id: "display",
    owners: ["tables", "accordion", "avatars", "kbd"],
    label: "Data display",
    Preview: DataDisplayPreview,
    Body: DataDisplaySection,
  },
  {
    id: "feedback",
    owners: ["badges", "spinner", "skeleton", "progress", "alert"],
    label: "Feedback",
    Preview: FeedbackPreview,
    Body: FeedbackSection,
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
