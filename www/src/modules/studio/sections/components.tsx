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
      "buttonMotion",
    ],
    label: "Buttons",
    aliases: [
      "Button",
      "Toggle button",
      "Button group",
      "Toggle button group",
      "Segmented control",
      "Pagination",
      "File trigger",
    ],
    Preview: ButtonsPreview,
    Body: ButtonsSection,
  },
  {
    id: "inputs",
    owners: [
      "inputs",
      "field",
      "number-field",
      "otp-field",
      "select",
      "inputMotion",
    ],
    label: "Inputs",
    aliases: [
      "Input",
      "Text field",
      "Text area",
      "Textarea",
      "Search field",
      "Number field",
      "OTP field",
      "Select",
      "Combobox",
      "Input group",
      "Token field",
      "Mention",
      "Field",
    ],
    Preview: InputsPreview,
    Body: InputsSection,
  },
  {
    id: "selection",
    owners: [
      "checkbox",
      "radio",
      "switch",
      "choice-cards",
      "sliders",
      "selectionMotion",
    ],
    label: "Selection",
    aliases: [
      "Checkbox",
      "Checkbox group",
      "Radio group",
      "Switch",
      "Slider",
      "Choice cards",
    ],
    Preview: SelectionPreview,
    Body: SelectionSection,
  },
  {
    id: "menus",
    owners: ["menus", "tooltips", "menuMotion"],
    label: "Menus & popovers",
    aliases: [
      "Menu",
      "Dropdown",
      "Context menu",
      "Popover",
      "Tooltip",
      "List box",
      "Command",
    ],
    Preview: MenusPreview,
    Body: MenusSection,
  },
  {
    id: "dialogs",
    owners: ["dialogs", "dialogMotion"],
    label: "Dialogs",
    aliases: ["Dialog", "Modal", "Alert dialog", "Drawer", "Sheet"],
    Preview: DialogsPreview,
    Body: DialogsSection,
  },
  {
    id: "nav",
    owners: ["navigation", "links", "breadcrumbs", "navMotion"],
    label: "Navigation",
    aliases: ["Tabs", "Sidebar", "Link", "Breadcrumbs"],
    Preview: NavigationPreview,
    Body: NavigationSection,
  },
  {
    id: "dates",
    owners: ["calendar", "dateMotion"],
    label: "Date & time",
    aliases: [
      "Calendar",
      "Date picker",
      "Date range picker",
      "Date field",
      "Time field",
      "Time picker",
    ],
    Preview: DatesPreview,
    Body: DatesSection,
  },
  {
    id: "display",
    owners: ["tables", "accordion", "avatars", "kbd", "card", "displayMotion"],
    label: "Data display",
    aliases: [
      "Table",
      "Accordion",
      "Collapsible",
      "Avatar",
      "Kbd",
      "Card",
      "Tag group",
      "Tree",
    ],
    Preview: DataDisplayPreview,
    Body: DataDisplaySection,
  },
  {
    id: "feedback",
    owners: [
      "badges",
      "alert",
      "toast",
      "spinner",
      "skeleton",
      "progress",
      "feedbackMotion",
    ],
    label: "Feedback",
    aliases: [
      "Badge",
      "Alert",
      "Toast",
      "Loader",
      "Spinner",
      "Skeleton",
      "Progress bar",
      "Empty",
    ],
    Preview: FeedbackPreview,
    Body: FeedbackSection,
  },
  {
    id: "charts",
    label: "Charts",
    aliases: ["Chart", "Area chart", "Bar chart", "Line chart", "Pie chart"],
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
