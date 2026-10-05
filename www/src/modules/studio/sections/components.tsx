"use client"

/* Components — one row per family, each opening the family's page in place
   of the panel. The row carries the family's headline value and specimen;
   the page holds the rest, so a new option never adds a row here. */

import { useContext } from "react"

import { CONTAINER_OPTIONS } from "../axes/accordion"
import { SHAPE_OPTIONS as AVATAR_SHAPES } from "../axes/avatars"
import { STYLE_OPTIONS as BADGE_STYLES } from "../axes/badges"
import { STYLE_OPTIONS as BUTTON_STYLES } from "../axes/buttons"
import { PALETTE_OPTIONS } from "../axes/charts"
import { CORNER_OPTIONS } from "../axes/checkbox"
import { BACKDROP_OPTIONS } from "../axes/dialogs"
import { STYLE_OPTIONS as INPUT_STYLES } from "../axes/inputs"
import { HIGHLIGHT_OPTIONS } from "../axes/menus"
import { CARET_OPTIONS } from "../axes/pickers"
import { THUMB_OPTIONS } from "../axes/sliders"
import { STYLE_OPTIONS as SPINNER_STYLES } from "../axes/spinner"
import { SEPARATION_OPTIONS } from "../axes/tables"
import { TAB_STYLE_OPTIONS } from "../axes/tabs"
import { DialLink, optionLabel } from "../dial"
import { PanelNav } from "../rows"
import type { ChapterPage, Studio, StudioState } from "../state"
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

interface Family extends ChapterPage {
  /** The headline value the row shows. */
  summary: (state: StudioState) => string
}

const FAMILIES: Family[] = [
  {
    id: "buttons",
    label: "Buttons",
    summary: (s) => optionLabel(BUTTON_STYLES, s.buttonStyle),
    Preview: ButtonsPreview,
    Body: ButtonsSection,
  },
  {
    id: "inputs",
    label: "Inputs",
    summary: (s) => optionLabel(INPUT_STYLES, s.inputStyle),
    Preview: InputsPreview,
    Body: InputsSection,
  },
  {
    id: "selection-controls",
    label: "Selection controls",
    summary: (s) => optionLabel(CORNER_OPTIONS, s.checkCorner),
    Preview: SelectionControlsPreview,
    Body: SelectionControlsSection,
  },
  {
    id: "pickers",
    label: "Pickers",
    summary: (s) => optionLabel(CARET_OPTIONS, s.pickerCaret),
    Preview: PickersPreview,
    Body: PickersSection,
  },
  {
    id: "sliders",
    label: "Sliders",
    summary: (s) => optionLabel(THUMB_OPTIONS, s.sliderThumb),
    Preview: SlidersPreview,
    Body: SlidersSection,
  },
  {
    id: "menus",
    label: "Menus",
    summary: (s) => optionLabel(HIGHLIGHT_OPTIONS, s.menuHighlight),
    Preview: MenusPreview,
    Body: MenusSection,
  },
  {
    id: "dialogs",
    label: "Dialogs",
    summary: (s) => optionLabel(BACKDROP_OPTIONS, s.dialogBackdrop),
    Preview: DialogsPreview,
    Body: DialogsSection,
  },
  {
    id: "popovers",
    label: "Popovers",
    summary: (s) => (s.popoverTip === "tip" ? "Arrow" : "Plain"),
    Preview: PopoversPreview,
    Body: PopoversSection,
  },
  {
    id: "navigation",
    label: "Navigation",
    summary: (s) => optionLabel(TAB_STYLE_OPTIONS, s.tabStyle),
    Preview: NavigationPreview,
    Body: NavigationSection,
  },
  {
    id: "loading",
    label: "Loading",
    summary: (s) => optionLabel(SPINNER_STYLES, s.spinnerStyle),
    Body: LoadingSection,
  },
  {
    id: "badges",
    label: "Badges",
    summary: (s) => optionLabel(BADGE_STYLES, s.badgeStyle),
    Preview: BadgesPreview,
    Body: BadgesSection,
  },
  {
    id: "avatars",
    label: "Avatars",
    summary: (s) => optionLabel(AVATAR_SHAPES, s.avatarShape),
    Preview: AvatarsPreview,
    Body: AvatarsSection,
  },
  {
    id: "tables",
    label: "Tables",
    summary: (s) => optionLabel(SEPARATION_OPTIONS, s.tableSeparation),
    Preview: TablesPreview,
    Body: TablesSection,
  },
  {
    id: "accordion",
    label: "Accordion",
    summary: (s) => optionLabel(CONTAINER_OPTIONS, s.accordionContainer),
    Preview: AccordionPreview,
    Body: AccordionSection,
  },
  {
    id: "charts",
    label: "Charts",
    summary: (s) => optionLabel(PALETTE_OPTIONS, s.chartPalette),
    Preview: ChartsPreview,
    Body: ChartsSection,
  },
]

export const COMPONENT_PAGES: ChapterPage[] = FAMILIES

export function ComponentsSection({ studio }: { studio: Studio }) {
  const { state } = studio
  const open = useContext(PanelNav)
  return (
    <>
      {FAMILIES.map(({ id, label, summary, Preview }) => (
        <DialLink
          key={id}
          label={label}
          onPress={() => open(id)}
          value={
            <>
              <span className="truncate">{summary(state)}</span>
              {Preview && <Preview state={state} />}
            </>
          }
        />
      ))}
    </>
  )
}
