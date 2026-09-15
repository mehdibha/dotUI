"use client"

/* The panel's composition root: the chapter list, and the design-system state
   it reads. Each section in sections/ owns its own axes — its defaults, its
   options, its body — and this file only orders them into a panel.

   A section's defaults slice IS its state slice: it's what the chapter card
   diffs to show "modified", and what Reset writes back. Adding an axis means
   adding a key to that one section's defaults; nothing here changes. */

import { DEFAULTS } from "./axes"
import type { StudioState } from "./axes"
import { ACCORDION_DEFAULTS } from "./axes/accordion"
import { ALERT_DEFAULTS } from "./axes/alert"
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
import { SCROLLBAR_DEFAULTS } from "./axes/scrollbars"
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
import { TOAST_DEFAULTS } from "./axes/toast"
import { TOGGLE_DEFAULTS } from "./axes/toggles"
import { TOOLTIP_DEFAULTS } from "./axes/tooltips"
import { TYPE_DEFAULTS } from "./axes/type"
import { AccordionSection } from "./sections/accordion"
import { AlertSection } from "./sections/alert"
import { AvatarsSection } from "./sections/avatars"
import { BadgesSection } from "./sections/badges"
import { BreadcrumbsSection } from "./sections/breadcrumbs"
import { ButtonGroupsSection } from "./sections/button-groups"
import { ButtonsSection } from "./sections/buttons"
import { CalendarSection } from "./sections/calendar"
import { ChartsSection } from "./sections/charts"
import { CheckboxSection } from "./sections/checkbox"
import { ChoiceCardsSection } from "./sections/choice-cards"
import { ColorSection, colorSummary } from "./sections/color"
import { CursorSection, cursorSummary } from "./sections/cursor"
import { DialogsSection } from "./sections/dialogs"
import { DisabledSection, disabledSummary } from "./sections/disabled"
import { FocusSection, focusSummary } from "./sections/focus"
import { IconsSection, iconsSummary } from "./sections/icons"
import { InputGroupsSection } from "./sections/input-groups"
import { InputsSection } from "./sections/inputs"
import { InvalidSection, invalidSummary } from "./sections/invalid"
import { KbdSection } from "./sections/kbd"
import { LinksSection } from "./sections/links"
import { MenusSection } from "./sections/menus"
import { MobileSection, mobileSummary } from "./sections/mobile"
import { MotionSection, motionSummary } from "./sections/motion"
import { NumberFieldSection } from "./sections/number-field"
import { OtpFieldSection } from "./sections/otp-field"
import { PaginationSection } from "./sections/pagination"
import { PickersSection } from "./sections/pickers"
import { PopoversSection } from "./sections/popovers"
import { ProgressSection } from "./sections/progress"
import { RadioSection } from "./sections/radio"
import { ScrollbarsSection, scrollbarsSummary } from "./sections/scrollbars"
import { SegmentedControlSection } from "./sections/segmented-control"
import { SelectionSection, selectionSummary } from "./sections/selection"
import { ShapeSection, shapeSummary } from "./sections/shape"
import { SkeletonSection } from "./sections/skeleton"
import { SlidersSection } from "./sections/sliders"
import { SpaceSection, spaceSummary } from "./sections/space"
import { SpinnerSection } from "./sections/spinner"
import { SurfacesSection, surfacesSummary } from "./sections/surfaces"
import { SwitchSection } from "./sections/switch"
import { TablesSection } from "./sections/tables"
import { TabsSection } from "./sections/tabs"
import { ToastSection } from "./sections/toast"
import { TogglesSection } from "./sections/toggles"
import { TooltipsSection } from "./sections/tooltips"
import { TypeSection, typeSummary } from "./sections/type"

export { DEFAULTS }
export type { StudioState } from "./axes"
import type { Studio } from "./use-studio"

export type { Studio }

export interface Chapter {
  id: string
  label: string
  defaults: Partial<StudioState>
  Body: React.ComponentType<{ studio: Studio }>
  /** The index row's live value, for chapters whose demo can't carry it. */
  summary?: (state: StudioState) => string
}

export const CHAPTERS: Chapter[] = [
  {
    id: "color",
    label: "Color",
    defaults: COLOR_DEFAULTS,
    Body: ColorSection,
    summary: colorSummary,
  },
  {
    id: "typography",
    label: "Typography",
    defaults: TYPE_DEFAULTS,
    Body: TypeSection,
    summary: typeSummary,
  },
  {
    id: "icons",
    label: "Icons",
    defaults: ICON_DEFAULTS,
    Body: IconsSection,
    summary: iconsSummary,
  },
  {
    id: "shape",
    label: "Shape",
    defaults: SHAPE_DEFAULTS,
    Body: ShapeSection,
    summary: shapeSummary,
  },
  {
    id: "space",
    label: "Space",
    defaults: SPACE_DEFAULTS,
    Body: SpaceSection,
    summary: spaceSummary,
  },
  {
    id: "surfaces",
    label: "Surfaces",
    defaults: SURFACE_DEFAULTS,
    Body: SurfacesSection,
    summary: surfacesSummary,
  },
  {
    id: "focus",
    label: "Focus",
    defaults: FOCUS_DEFAULTS,
    Body: FocusSection,
    summary: focusSummary,
  },
  {
    id: "cursor",
    label: "Cursor",
    defaults: CURSOR_DEFAULTS,
    Body: CursorSection,
    summary: cursorSummary,
  },
  {
    id: "selection",
    label: "Text selection",
    defaults: SELECTION_DEFAULTS,
    Body: SelectionSection,
    summary: selectionSummary,
  },
  {
    id: "scrollbars",
    label: "Scrollbars",
    defaults: SCROLLBAR_DEFAULTS,
    Body: ScrollbarsSection,
    summary: scrollbarsSummary,
  },
  {
    id: "disabled",
    label: "Disabled",
    defaults: DISABLED_DEFAULTS,
    Body: DisabledSection,
    summary: disabledSummary,
  },
  {
    id: "invalid",
    label: "Invalid",
    defaults: INVALID_DEFAULTS,
    Body: InvalidSection,
    summary: invalidSummary,
  },
  {
    id: "charts",
    label: "Charts",
    defaults: CHART_DEFAULTS,
    Body: ChartsSection,
  },
  {
    id: "motion",
    label: "Motion",
    defaults: MOTION_DEFAULTS,
    Body: MotionSection,
    summary: motionSummary,
  },
  {
    id: "mobile",
    label: "Mobile",
    defaults: MOBILE_DEFAULTS,
    Body: MobileSection,
    summary: mobileSummary,
  },
  {
    id: "links",
    label: "Links",
    defaults: LINK_DEFAULTS,
    Body: LinksSection,
  },
  {
    id: "alert",
    label: "Alert",
    defaults: ALERT_DEFAULTS,
    Body: AlertSection,
  },
  {
    id: "toast",
    label: "Toast",
    defaults: TOAST_DEFAULTS,
    Body: ToastSection,
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
  {
    id: "radio",
    label: "Radio",
    defaults: RADIO_DEFAULTS,
    Body: RadioSection,
  },
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
  {
    id: "menus",
    label: "Menus",
    defaults: MENU_DEFAULTS,
    Body: MenusSection,
  },
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
  {
    id: "tabs",
    label: "Tabs",
    defaults: TAB_DEFAULTS,
    Body: TabsSection,
  },
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
  {
    id: "kbd",
    label: "Kbd",
    defaults: KBD_DEFAULTS,
    Body: KbdSection,
  },
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
