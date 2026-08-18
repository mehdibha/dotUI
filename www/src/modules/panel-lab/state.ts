"use client"

/* The panel's composition root: the chapter list, and the design-system state
   it reads. Each section in sections/ owns its own axes — its defaults, its
   options, its body — and this file only orders them into a panel.

   A section's defaults slice IS its state slice: it's what the chapter card
   diffs to show "modified", and what Reset writes back. Adding an axis means
   adding a key to that one section's defaults; nothing here changes. */

import { AccordionSection, ACCORDION_DEFAULTS } from "./sections/accordion"
import { AvatarsSection, AVATAR_DEFAULTS } from "./sections/avatars"
import { BadgesSection, BADGE_DEFAULTS } from "./sections/badges"
import { BreadcrumbsSection, BREADCRUMB_DEFAULTS } from "./sections/breadcrumbs"
import {
  ButtonGroupsSection,
  BUTTON_GROUP_DEFAULTS,
} from "./sections/button-groups"
import { ButtonsSection, BUTTON_DEFAULTS } from "./sections/buttons"
import { CalendarSection, CALENDAR_DEFAULTS } from "./sections/calendar"
import { CheckboxSection, CHECKBOX_DEFAULTS } from "./sections/checkbox"
import {
  ChoiceCardsSection,
  CHOICE_CARD_DEFAULTS,
} from "./sections/choice-cards"
import { ColorSection, COLOR_DEFAULTS } from "./sections/color"
import { CursorSection, CURSOR_DEFAULTS } from "./sections/cursor"
import { DialogsSection, DIALOG_DEFAULTS } from "./sections/dialogs"
import { DisabledSection, DISABLED_DEFAULTS } from "./sections/disabled"
import { FocusSection, FOCUS_DEFAULTS } from "./sections/focus"
import { IconsSection, ICON_DEFAULTS } from "./sections/icons"
import {
  InputGroupsSection,
  INPUT_GROUP_DEFAULTS,
} from "./sections/input-groups"
import { InputsSection, INPUT_DEFAULTS } from "./sections/inputs"
import { KbdSection, KBD_DEFAULTS } from "./sections/kbd"
import { LinksSection, LINK_DEFAULTS } from "./sections/links"
import { MenusSection, MENU_DEFAULTS } from "./sections/menus"
import { MotionSection, MOTION_DEFAULTS } from "./sections/motion"
import { NoticesSection, NOTICE_DEFAULTS } from "./sections/notices"
import {
  NumberFieldSection,
  NUMBER_FIELD_DEFAULTS,
} from "./sections/number-field"
import { OtpFieldSection, OTP_FIELD_DEFAULTS } from "./sections/otp-field"
import { PaginationSection, PAGINATION_DEFAULTS } from "./sections/pagination"
import { PickersSection, PICKER_DEFAULTS } from "./sections/pickers"
import { PopoversSection, POPOVER_DEFAULTS } from "./sections/popovers"
import { ProgressSection, PROGRESS_DEFAULTS } from "./sections/progress"
import { RadioSection, RADIO_DEFAULTS } from "./sections/radio"
import { ScrollbarsSection, SCROLLBAR_DEFAULTS } from "./sections/scrollbars"
import {
  SegmentedControlSection,
  SEGMENTED_DEFAULTS,
} from "./sections/segmented-control"
import { SelectionSection, SELECTION_DEFAULTS } from "./sections/selection"
import { ShapeSection, SHAPE_DEFAULTS } from "./sections/shape"
import { SkeletonSection, SKELETON_DEFAULTS } from "./sections/skeleton"
import { SlidersSection, SLIDER_DEFAULTS } from "./sections/sliders"
import { SpaceSection, SPACE_DEFAULTS } from "./sections/space"
import { SpinnerSection, SPINNER_DEFAULTS } from "./sections/spinner"
import { SurfacesSection, SURFACE_DEFAULTS } from "./sections/surfaces"
import { SwitchSection, SWITCH_DEFAULTS } from "./sections/switch"
import { TablesSection, TABLE_DEFAULTS } from "./sections/tables"
import { TabsSection, TAB_DEFAULTS } from "./sections/tabs"
import { TogglesSection, TOGGLE_DEFAULTS } from "./sections/toggles"
import { TooltipsSection, TOOLTIP_DEFAULTS } from "./sections/tooltips"
import { TypeSection, TYPE_DEFAULTS } from "./sections/type"

export const DEFAULTS = {
  ...COLOR_DEFAULTS,
  ...TYPE_DEFAULTS,
  ...ICON_DEFAULTS,
  ...SHAPE_DEFAULTS,
  ...SPACE_DEFAULTS,
  ...SURFACE_DEFAULTS,
  ...FOCUS_DEFAULTS,
  ...CURSOR_DEFAULTS,
  ...SELECTION_DEFAULTS,
  ...SCROLLBAR_DEFAULTS,
  ...DISABLED_DEFAULTS,
  ...MOTION_DEFAULTS,
  ...LINK_DEFAULTS,
  ...NOTICE_DEFAULTS,
  ...SKELETON_DEFAULTS,
  ...SPINNER_DEFAULTS,
  ...PROGRESS_DEFAULTS,
  ...BUTTON_DEFAULTS,
  ...BUTTON_GROUP_DEFAULTS,
  ...TOGGLE_DEFAULTS,
  ...SEGMENTED_DEFAULTS,
  ...SWITCH_DEFAULTS,
  ...CHECKBOX_DEFAULTS,
  ...RADIO_DEFAULTS,
  ...CHOICE_CARD_DEFAULTS,
  ...INPUT_DEFAULTS,
  ...INPUT_GROUP_DEFAULTS,
  ...NUMBER_FIELD_DEFAULTS,
  ...OTP_FIELD_DEFAULTS,
  ...PICKER_DEFAULTS,
  ...CALENDAR_DEFAULTS,
  ...SLIDER_DEFAULTS,
  ...MENU_DEFAULTS,
  ...DIALOG_DEFAULTS,
  ...POPOVER_DEFAULTS,
  ...TOOLTIP_DEFAULTS,
  ...TAB_DEFAULTS,
  ...ACCORDION_DEFAULTS,
  ...BREADCRUMB_DEFAULTS,
  ...PAGINATION_DEFAULTS,
  ...BADGE_DEFAULTS,
  ...KBD_DEFAULTS,
  ...AVATAR_DEFAULTS,
  ...TABLE_DEFAULTS,
}

export type LabState = typeof DEFAULTS

export interface Lab {
  state: LabState
  set: <K extends keyof LabState>(key: K) => (value: LabState[K]) => void
  /** Modified-vs-default and reset for one section, from its defaults slice. */
  section: (defaults: Partial<LabState>) => {
    modified: boolean
    onReset: () => void
  }
}

export interface Chapter {
  id: string
  label: string
  defaults: Partial<LabState>
  Body: React.ComponentType<{ lab: Lab }>
}

export const CHAPTERS: Chapter[] = [
  { id: "color", label: "Color", defaults: COLOR_DEFAULTS, Body: ColorSection },
  {
    id: "typography",
    label: "Typography",
    defaults: TYPE_DEFAULTS,
    Body: TypeSection,
  },
  { id: "icons", label: "Icons", defaults: ICON_DEFAULTS, Body: IconsSection },
  { id: "shape", label: "Shape", defaults: SHAPE_DEFAULTS, Body: ShapeSection },
  { id: "space", label: "Space", defaults: SPACE_DEFAULTS, Body: SpaceSection },
  {
    id: "surfaces",
    label: "Surfaces",
    defaults: SURFACE_DEFAULTS,
    Body: SurfacesSection,
  },
  { id: "focus", label: "Focus", defaults: FOCUS_DEFAULTS, Body: FocusSection },
  {
    id: "cursor",
    label: "Cursor",
    defaults: CURSOR_DEFAULTS,
    Body: CursorSection,
  },
  {
    id: "selection",
    label: "Selection",
    defaults: SELECTION_DEFAULTS,
    Body: SelectionSection,
  },
  {
    id: "scrollbars",
    label: "Scrollbars",
    defaults: SCROLLBAR_DEFAULTS,
    Body: ScrollbarsSection,
  },
  {
    id: "disabled",
    label: "Disabled",
    defaults: DISABLED_DEFAULTS,
    Body: DisabledSection,
  },
  {
    id: "motion",
    label: "Motion",
    defaults: MOTION_DEFAULTS,
    Body: MotionSection,
  },
  { id: "links", label: "Links", defaults: LINK_DEFAULTS, Body: LinksSection },
  {
    id: "notices",
    label: "Notices",
    defaults: NOTICE_DEFAULTS,
    Body: NoticesSection,
  },
  {
    id: "skeleton",
    label: "Skeleton",
    defaults: SKELETON_DEFAULTS,
    Body: SkeletonSection,
  },
  {
    id: "spinner",
    label: "Spinner",
    defaults: SPINNER_DEFAULTS,
    Body: SpinnerSection,
  },
  {
    id: "progress",
    label: "Progress",
    defaults: PROGRESS_DEFAULTS,
    Body: ProgressSection,
  },
  {
    id: "buttons",
    label: "Buttons",
    defaults: BUTTON_DEFAULTS,
    Body: ButtonsSection,
  },
  {
    id: "button-groups",
    label: "Button groups",
    defaults: BUTTON_GROUP_DEFAULTS,
    Body: ButtonGroupsSection,
  },
  {
    id: "toggles",
    label: "Toggles",
    defaults: TOGGLE_DEFAULTS,
    Body: TogglesSection,
  },
  {
    id: "segmented-control",
    label: "Segmented control",
    defaults: SEGMENTED_DEFAULTS,
    Body: SegmentedControlSection,
  },
  {
    id: "switch",
    label: "Switch",
    defaults: SWITCH_DEFAULTS,
    Body: SwitchSection,
  },
  {
    id: "checkbox",
    label: "Checkbox",
    defaults: CHECKBOX_DEFAULTS,
    Body: CheckboxSection,
  },
  { id: "radio", label: "Radio", defaults: RADIO_DEFAULTS, Body: RadioSection },
  {
    id: "choice-cards",
    label: "Choice cards",
    defaults: CHOICE_CARD_DEFAULTS,
    Body: ChoiceCardsSection,
  },
  {
    id: "inputs",
    label: "Inputs",
    defaults: INPUT_DEFAULTS,
    Body: InputsSection,
  },
  {
    id: "input-groups",
    label: "Input groups",
    defaults: INPUT_GROUP_DEFAULTS,
    Body: InputGroupsSection,
  },
  {
    id: "number-field",
    label: "Number field",
    defaults: NUMBER_FIELD_DEFAULTS,
    Body: NumberFieldSection,
  },
  {
    id: "otp-field",
    label: "OTP field",
    defaults: OTP_FIELD_DEFAULTS,
    Body: OtpFieldSection,
  },
  {
    id: "pickers",
    label: "Pickers",
    defaults: PICKER_DEFAULTS,
    Body: PickersSection,
  },
  {
    id: "calendar",
    label: "Calendar",
    defaults: CALENDAR_DEFAULTS,
    Body: CalendarSection,
  },
  {
    id: "sliders",
    label: "Sliders",
    defaults: SLIDER_DEFAULTS,
    Body: SlidersSection,
  },
  { id: "menus", label: "Menus", defaults: MENU_DEFAULTS, Body: MenusSection },
  {
    id: "dialogs",
    label: "Dialogs",
    defaults: DIALOG_DEFAULTS,
    Body: DialogsSection,
  },
  {
    id: "popovers",
    label: "Popovers",
    defaults: POPOVER_DEFAULTS,
    Body: PopoversSection,
  },
  {
    id: "tooltips",
    label: "Tooltips",
    defaults: TOOLTIP_DEFAULTS,
    Body: TooltipsSection,
  },
  { id: "tabs", label: "Tabs", defaults: TAB_DEFAULTS, Body: TabsSection },
  {
    id: "accordion",
    label: "Accordion",
    defaults: ACCORDION_DEFAULTS,
    Body: AccordionSection,
  },
  {
    id: "breadcrumbs",
    label: "Breadcrumbs",
    defaults: BREADCRUMB_DEFAULTS,
    Body: BreadcrumbsSection,
  },
  {
    id: "pagination",
    label: "Pagination",
    defaults: PAGINATION_DEFAULTS,
    Body: PaginationSection,
  },
  {
    id: "badges",
    label: "Badges",
    defaults: BADGE_DEFAULTS,
    Body: BadgesSection,
  },
  { id: "kbd", label: "Kbd", defaults: KBD_DEFAULTS, Body: KbdSection },
  {
    id: "avatars",
    label: "Avatars",
    defaults: AVATAR_DEFAULTS,
    Body: AvatarsSection,
  },
  {
    id: "tables",
    label: "Tables",
    defaults: TABLE_DEFAULTS,
    Body: TablesSection,
  },
]
