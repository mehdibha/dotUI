"use client"

/* The panel's composition root: the groups, in page order, and the
   design-system state they read. Each section in sections/ owns its own
   axes — its options, its rows — and this file only orders them into a
   panel.

   A group's defaults slice IS its state slice: what it diffs to show
   "modified", and what Reset writes back. Adding an axis means adding a key
   to that one axis module's defaults and to its group here. */

import { DEFAULTS } from "./axes"
import type { StudioState } from "./axes"
import { ACCORDION_DEFAULTS } from "./axes/accordion"
import { AVATAR_DEFAULTS } from "./axes/avatars"
import { BADGE_DEFAULTS } from "./axes/badges"
import { BREADCRUMB_DEFAULTS } from "./axes/breadcrumbs"
import { BUTTON_GROUP_DEFAULTS } from "./axes/button-groups"
import { BUTTON_DEFAULTS } from "./axes/buttons"
import { CALENDAR_DEFAULTS } from "./axes/calendar"
import { CHART_DEFAULTS } from "./axes/charts"
import { CHECKBOX_DEFAULTS } from "./axes/checkbox"
import { CHOICE_CARD_DEFAULTS } from "./axes/choice-cards"
import { COLOR_DEFAULTS } from "./axes/color"
import { CURSOR_DEFAULTS } from "./axes/cursor"
import { DIALOG_DEFAULTS } from "./axes/dialogs"
import { DISABLED_DEFAULTS } from "./axes/disabled"
import { FOCUS_DEFAULTS } from "./axes/focus"
import { ICON_DEFAULTS } from "./axes/icons"
import { INPUT_GROUP_DEFAULTS } from "./axes/input-groups"
import { INPUT_DEFAULTS } from "./axes/inputs"
import { INVALID_DEFAULTS } from "./axes/invalid"
import { KBD_DEFAULTS } from "./axes/kbd"
import { LINK_DEFAULTS } from "./axes/links"
import { MENU_DEFAULTS } from "./axes/menus"
import { MOBILE_DEFAULTS } from "./axes/mobile"
import { MOTION_DEFAULTS } from "./axes/motion"
import { NUMBER_FIELD_DEFAULTS } from "./axes/number-field"
import { OTP_FIELD_DEFAULTS } from "./axes/otp-field"
import { PAGINATION_DEFAULTS } from "./axes/pagination"
import { PICKER_DEFAULTS } from "./axes/pickers"
import { POPOVER_DEFAULTS } from "./axes/popovers"
import { PROGRESS_DEFAULTS } from "./axes/progress"
import { RADIO_DEFAULTS } from "./axes/radio"
import { SEGMENTED_DEFAULTS } from "./axes/segmented-control"
import { SELECTION_DEFAULTS } from "./axes/selection"
import { SHAPE_DEFAULTS } from "./axes/shape"
import { SKELETON_DEFAULTS } from "./axes/skeleton"
import { SLIDER_DEFAULTS } from "./axes/sliders"
import { SPACE_DEFAULTS } from "./axes/space"
import { SPINNER_DEFAULTS } from "./axes/spinner"
import { SURFACE_DEFAULTS } from "./axes/surfaces"
import { SWITCH_DEFAULTS } from "./axes/switch"
import { TABLE_DEFAULTS } from "./axes/tables"
import { TAB_DEFAULTS } from "./axes/tabs"
import { TOGGLE_DEFAULTS } from "./axes/toggles"
import { TOOLTIP_DEFAULTS } from "./axes/tooltips"
import { TYPE_DEFAULTS } from "./axes/type"
import { AccordionSection } from "./sections/accordion"
import { AvatarsSection } from "./sections/avatars"
import { BadgesSection } from "./sections/badges"
import { BrowserSection } from "./sections/browser"
import { ButtonsSection } from "./sections/buttons"
import { ChartsSection } from "./sections/charts"
import { ColorPrimary, ColorSection } from "./sections/color"
import { DialogsSection } from "./sections/dialogs"
import { IconsSection } from "./sections/icons"
import { InputsSection } from "./sections/inputs"
import { LoadingSection } from "./sections/loading"
import { MenusSection } from "./sections/menus"
import { MotionSection } from "./sections/motion"
import { NavigationSection } from "./sections/navigation"
import { PickersSection } from "./sections/pickers"
import { PopoversSection } from "./sections/popovers"
import { SelectionControlsSection } from "./sections/selection-controls"
import { ShapeSection } from "./sections/shape"
import { SlidersSection } from "./sections/sliders"
import { SpaceSection } from "./sections/space"
import { StatesSection } from "./sections/states"
import { TablesSection } from "./sections/tables"
import { TypeSection } from "./sections/type"

export { DEFAULTS }
export type { StudioState } from "./axes"
import type { Studio } from "./use-studio"

export type { Studio }

/** A run of rows the page separates from the next — no title on the page;
 *  the label names it on the mobile strip, in search and to screen readers. */
export interface Chapter {
  id: string
  label: string
  defaults: Partial<StudioState>
  /** Sections, in order; each renders one or more rows. */
  rows: React.ComponentType<{ studio: Studio }>[]
}

/* Identity first, then the treatments every control wears, then every
   component on its own row, grouped by kind. Alert and Toast have no axes
   yet and stay off the page until they are rebuilt from preset evidence. */
export const CHAPTERS: Chapter[] = [
  {
    id: "color",
    label: "Color",
    defaults: { ...COLOR_DEFAULTS, ...SURFACE_DEFAULTS },
    rows: [ColorPrimary, ColorSection],
  },
  { id: "fonts", label: "Fonts", defaults: TYPE_DEFAULTS, rows: [TypeSection] },
  {
    id: "icons",
    label: "Icons",
    defaults: ICON_DEFAULTS,
    rows: [IconsSection],
  },
  {
    id: "radius",
    label: "Radius",
    defaults: SHAPE_DEFAULTS,
    rows: [ShapeSection],
  },
  {
    id: "density",
    label: "Density",
    defaults: SPACE_DEFAULTS,
    rows: [SpaceSection],
  },
  {
    id: "states",
    label: "States",
    defaults: { ...FOCUS_DEFAULTS, ...DISABLED_DEFAULTS, ...INVALID_DEFAULTS },
    rows: [StatesSection],
  },
  {
    id: "cursor",
    label: "Cursor",
    defaults: { ...CURSOR_DEFAULTS, ...SELECTION_DEFAULTS },
    rows: [BrowserSection],
  },
  {
    id: "motion",
    label: "Motion",
    defaults: MOTION_DEFAULTS,
    rows: [MotionSection],
  },
  {
    id: "actions",
    label: "Actions",
    defaults: {
      ...BUTTON_DEFAULTS,
      ...TOGGLE_DEFAULTS,
      ...BUTTON_GROUP_DEFAULTS,
      ...SEGMENTED_DEFAULTS,
    },
    rows: [ButtonsSection],
  },
  {
    id: "fields",
    label: "Fields",
    defaults: {
      ...INPUT_DEFAULTS,
      ...INPUT_GROUP_DEFAULTS,
      ...NUMBER_FIELD_DEFAULTS,
      ...OTP_FIELD_DEFAULTS,
      ...PICKER_DEFAULTS,
      ...CALENDAR_DEFAULTS,
    },
    rows: [InputsSection, PickersSection],
  },
  {
    id: "selection",
    label: "Selection",
    defaults: {
      ...CHECKBOX_DEFAULTS,
      ...RADIO_DEFAULTS,
      ...SWITCH_DEFAULTS,
      ...CHOICE_CARD_DEFAULTS,
      ...SLIDER_DEFAULTS,
    },
    rows: [SelectionControlsSection, SlidersSection],
  },
  {
    id: "overlays",
    label: "Overlays",
    defaults: {
      ...DIALOG_DEFAULTS,
      ...POPOVER_DEFAULTS,
      ...MOBILE_DEFAULTS,
      ...TOOLTIP_DEFAULTS,
      ...MENU_DEFAULTS,
    },
    rows: [DialogsSection, PopoversSection, MenusSection],
  },
  {
    id: "navigation",
    label: "Navigation",
    defaults: {
      ...LINK_DEFAULTS,
      ...TAB_DEFAULTS,
      ...BREADCRUMB_DEFAULTS,
      ...PAGINATION_DEFAULTS,
    },
    rows: [NavigationSection],
  },
  {
    id: "display",
    label: "Display",
    defaults: {
      ...AVATAR_DEFAULTS,
      ...BADGE_DEFAULTS,
      ...KBD_DEFAULTS,
      ...TABLE_DEFAULTS,
      ...ACCORDION_DEFAULTS,
      ...CHART_DEFAULTS,
    },
    rows: [
      AvatarsSection,
      BadgesSection,
      TablesSection,
      AccordionSection,
      ChartsSection,
    ],
  },
  {
    id: "feedback",
    label: "Feedback",
    defaults: {
      ...PROGRESS_DEFAULTS,
      ...SKELETON_DEFAULTS,
      ...SPINNER_DEFAULTS,
    },
    rows: [LoadingSection],
  },
]
