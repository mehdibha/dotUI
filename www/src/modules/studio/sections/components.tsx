"use client"

/* Components — one row per family, each opening the family's whole recipe
   beside it. The row carries the family's headline value and its specimen;
   everything else lives in the popover, so a new option never adds a row. */

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
import { DialPopover, DialTrigger, optionLabel } from "../dial"
import type { Studio, StudioState } from "../state"
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

interface Family {
  label: string
  /** The headline value the row shows. */
  summary: (state: StudioState) => string
  Preview?: React.ComponentType<{ state: StudioState }>
  Body: React.ComponentType<{ studio: Studio }>
}

const FAMILIES: Family[] = [
  {
    label: "Buttons",
    summary: (s) => optionLabel(BUTTON_STYLES, s.buttonStyle),
    Preview: ButtonsPreview,
    Body: ButtonsSection,
  },
  {
    label: "Inputs",
    summary: (s) => optionLabel(INPUT_STYLES, s.inputStyle),
    Preview: InputsPreview,
    Body: InputsSection,
  },
  {
    label: "Selection controls",
    summary: (s) => optionLabel(CORNER_OPTIONS, s.checkCorner),
    Preview: SelectionControlsPreview,
    Body: SelectionControlsSection,
  },
  {
    label: "Pickers",
    summary: (s) => optionLabel(CARET_OPTIONS, s.pickerCaret),
    Preview: PickersPreview,
    Body: PickersSection,
  },
  {
    label: "Sliders",
    summary: (s) => optionLabel(THUMB_OPTIONS, s.sliderThumb),
    Preview: SlidersPreview,
    Body: SlidersSection,
  },
  {
    label: "Menus",
    summary: (s) => optionLabel(HIGHLIGHT_OPTIONS, s.menuHighlight),
    Preview: MenusPreview,
    Body: MenusSection,
  },
  {
    label: "Dialogs",
    summary: (s) => optionLabel(BACKDROP_OPTIONS, s.dialogBackdrop),
    Preview: DialogsPreview,
    Body: DialogsSection,
  },
  {
    label: "Popovers",
    summary: (s) => (s.popoverTip === "tip" ? "Arrow" : "Plain"),
    Preview: PopoversPreview,
    Body: PopoversSection,
  },
  {
    label: "Navigation",
    summary: (s) => optionLabel(TAB_STYLE_OPTIONS, s.tabStyle),
    Preview: NavigationPreview,
    Body: NavigationSection,
  },
  {
    label: "Loading",
    summary: (s) => optionLabel(SPINNER_STYLES, s.spinnerStyle),
    Body: LoadingSection,
  },
  {
    label: "Badges",
    summary: (s) => optionLabel(BADGE_STYLES, s.badgeStyle),
    Preview: BadgesPreview,
    Body: BadgesSection,
  },
  {
    label: "Avatars",
    summary: (s) => optionLabel(AVATAR_SHAPES, s.avatarShape),
    Preview: AvatarsPreview,
    Body: AvatarsSection,
  },
  {
    label: "Tables",
    summary: (s) => optionLabel(SEPARATION_OPTIONS, s.tableSeparation),
    Preview: TablesPreview,
    Body: TablesSection,
  },
  {
    label: "Accordion",
    summary: (s) => optionLabel(CONTAINER_OPTIONS, s.accordionContainer),
    Preview: AccordionPreview,
    Body: AccordionSection,
  },
  {
    label: "Charts",
    summary: (s) => optionLabel(PALETTE_OPTIONS, s.chartPalette),
    Preview: ChartsPreview,
    Body: ChartsSection,
  },
]

export function ComponentsSection({ studio }: { studio: Studio }) {
  const { state } = studio
  return (
    <>
      {FAMILIES.map(({ label, summary, Preview, Body }) => (
        <DialTrigger
          key={label}
          label={label}
          value={
            <>
              <span className="truncate">{summary(state)}</span>
              {Preview && <Preview state={state} />}
            </>
          }
        >
          <DialPopover className="w-80">
            <Body studio={studio} />
          </DialPopover>
        </DialTrigger>
      ))}
    </>
  )
}
