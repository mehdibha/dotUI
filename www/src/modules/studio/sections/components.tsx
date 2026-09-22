"use client"

/* Components — one row per family, each opening the family's whole recipe
   beside it. The row carries the family's headline value and its specimen;
   everything else lives in the popover, so a new option never adds a row. */

import { ACCORDION_DEFAULTS, CONTAINER_OPTIONS } from "../axes/accordion"
import {
  AVATAR_DEFAULTS,
  SHAPE_OPTIONS as AVATAR_SHAPES,
} from "../axes/avatars"
import { BADGE_DEFAULTS, STYLE_OPTIONS as BADGE_STYLES } from "../axes/badges"
import { BREADCRUMB_DEFAULTS } from "../axes/breadcrumbs"
import { BUTTON_GROUP_DEFAULTS } from "../axes/button-groups"
import {
  BUTTON_DEFAULTS,
  STYLE_OPTIONS as BUTTON_STYLES,
} from "../axes/buttons"
import { CALENDAR_DEFAULTS } from "../axes/calendar"
import { CHART_DEFAULTS, PALETTE_OPTIONS, paletteOption } from "../axes/charts"
import { CHECKBOX_DEFAULTS, CORNER_OPTIONS } from "../axes/checkbox"
import { CHOICE_CARD_DEFAULTS } from "../axes/choice-cards"
import { BACKDROP_OPTIONS, DIALOG_DEFAULTS } from "../axes/dialogs"
import { INPUT_GROUP_DEFAULTS } from "../axes/input-groups"
import { INPUT_DEFAULTS, STYLE_OPTIONS as INPUT_STYLES } from "../axes/inputs"
import { KBD_DEFAULTS } from "../axes/kbd"
import { LINK_DEFAULTS } from "../axes/links"
import { HIGHLIGHT_OPTIONS, MENU_DEFAULTS } from "../axes/menus"
import { NUMBER_FIELD_DEFAULTS } from "../axes/number-field"
import { OTP_FIELD_DEFAULTS } from "../axes/otp-field"
import { PAGINATION_DEFAULTS } from "../axes/pagination"
import { CARET_OPTIONS, PICKER_DEFAULTS } from "../axes/pickers"
import { POPOVER_DEFAULTS } from "../axes/popovers"
import { PROGRESS_DEFAULTS } from "../axes/progress"
import { RADIO_DEFAULTS } from "../axes/radio"
import { SEGMENTED_DEFAULTS } from "../axes/segmented-control"
import { SKELETON_DEFAULTS } from "../axes/skeleton"
import { SLIDER_DEFAULTS, THUMB_OPTIONS } from "../axes/sliders"
import {
  SPINNER_DEFAULTS,
  STYLE_OPTIONS as SPINNER_STYLES,
} from "../axes/spinner"
import { SWITCH_DEFAULTS } from "../axes/switch"
import { SEPARATION_OPTIONS, TABLE_DEFAULTS } from "../axes/tables"
import { TAB_DEFAULTS, TAB_STYLE_OPTIONS } from "../axes/tabs"
import { TOGGLE_DEFAULTS } from "../axes/toggles"
import { TOOLTIP_DEFAULTS } from "../axes/tooltips"
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

export const COMPONENTS_DEFAULTS = {
  ...BUTTON_DEFAULTS,
  ...BUTTON_GROUP_DEFAULTS,
  ...TOGGLE_DEFAULTS,
  ...SEGMENTED_DEFAULTS,
  ...INPUT_DEFAULTS,
  ...INPUT_GROUP_DEFAULTS,
  ...NUMBER_FIELD_DEFAULTS,
  ...OTP_FIELD_DEFAULTS,
  ...CHECKBOX_DEFAULTS,
  ...RADIO_DEFAULTS,
  ...SWITCH_DEFAULTS,
  ...CHOICE_CARD_DEFAULTS,
  ...PICKER_DEFAULTS,
  ...CALENDAR_DEFAULTS,
  ...SLIDER_DEFAULTS,
  ...MENU_DEFAULTS,
  ...DIALOG_DEFAULTS,
  ...POPOVER_DEFAULTS,
  ...TOOLTIP_DEFAULTS,
  ...LINK_DEFAULTS,
  ...TAB_DEFAULTS,
  ...BREADCRUMB_DEFAULTS,
  ...PAGINATION_DEFAULTS,
  ...SKELETON_DEFAULTS,
  ...SPINNER_DEFAULTS,
  ...PROGRESS_DEFAULTS,
  ...BADGE_DEFAULTS,
  ...KBD_DEFAULTS,
  ...AVATAR_DEFAULTS,
  ...TABLE_DEFAULTS,
  ...ACCORDION_DEFAULTS,
  ...CHART_DEFAULTS,
}

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
    summary: (s) => optionLabel(PALETTE_OPTIONS, paletteOption(s.chartPalette)),
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
