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
import { NOTICE_DEFAULTS } from "./axes/notices"
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
import { TOGGLE_DEFAULTS } from "./axes/toggles"
import { TOOLTIP_DEFAULTS } from "./axes/tooltips"
import { TYPE_DEFAULTS } from "./axes/type"
import {
  AccordionSection,
  AccordionHero,
  accordionSummary,
} from "./sections/accordion"
import { AvatarsSection, AvatarsHero, avatarsSummary } from "./sections/avatars"
import { BadgesSection, BadgesHero, badgesSummary } from "./sections/badges"
import {
  BreadcrumbsSection,
  BreadcrumbsHero,
  breadcrumbsSummary,
} from "./sections/breadcrumbs"
import {
  ButtonGroupsSection,
  ButtonGroupHero,
  buttonGroupsSummary,
} from "./sections/button-groups"
import { ButtonsHero, ButtonsSection, buttonsSummary } from "./sections/buttons"
import {
  CalendarSection,
  CalendarHero,
  calendarSummary,
} from "./sections/calendar"
import { ChartsHero, ChartsSection, chartsSummary } from "./sections/charts"
import {
  CheckboxSection,
  CheckboxHero,
  checkboxSummary,
} from "./sections/checkbox"
import {
  ChoiceCardsSection,
  ChoiceCardsHero,
  choiceCardsSummary,
} from "./sections/choice-cards"
import { ColorSection, colorSummary } from "./sections/color"
import { CursorSection, CursorHero, cursorSummary } from "./sections/cursor"
import { DialogsSection, DialogsHero, dialogsSummary } from "./sections/dialogs"
import {
  DisabledSection,
  DisabledHero,
  disabledSummary,
} from "./sections/disabled"
import { FocusSection, FocusHero, focusSummary } from "./sections/focus"
import { IconsHero, IconsSection, iconsSummary } from "./sections/icons"
import {
  InputGroupsSection,
  AddonsHero,
  inputGroupsSummary,
} from "./sections/input-groups"
import { FieldHero, InputsSection, inputsSummary } from "./sections/inputs"
import { InvalidHero, InvalidSection, invalidSummary } from "./sections/invalid"
import { KbdSection, KbdHero, kbdSummary } from "./sections/kbd"
import { LinksSection, LinksHero, linksSummary } from "./sections/links"
import { MenusHero, MenusSection, menusSummary } from "./sections/menus"
import { MobileHero, MobileSection, mobileSummary } from "./sections/mobile"
import { MotionSection, MotionHero, motionSummary } from "./sections/motion"
import { NoticesSection, NoticesHero, noticesSummary } from "./sections/notices"
import {
  NumberFieldSection,
  NumberHero,
  numberFieldSummary,
} from "./sections/number-field"
import { OtpFieldSection, OtpHero, otpFieldSummary } from "./sections/otp-field"
import {
  PaginationSection,
  PaginationHero,
  paginationSummary,
} from "./sections/pagination"
import { PickersSection, PickersHero, pickersSummary } from "./sections/pickers"
import {
  PopoversSection,
  PopoversHero,
  popoversSummary,
} from "./sections/popovers"
import {
  ProgressSection,
  ProgressHero,
  progressSummary,
} from "./sections/progress"
import { RadioSection, RadioHero, radioSummary } from "./sections/radio"
import {
  ScrollbarsSection,
  ScrollbarsHero,
  scrollbarsSummary,
} from "./sections/scrollbars"
import {
  SegmentedControlSection,
  SegmentedHero,
  segmentedControlSummary,
} from "./sections/segmented-control"
import {
  SelectionSection,
  SelectionHero,
  selectionSummary,
} from "./sections/selection"
import { ShapeHero, ShapeSection, shapeSummary } from "./sections/shape"
import {
  SkeletonSection,
  SkeletonHero,
  skeletonSummary,
} from "./sections/skeleton"
import { SlidersSection, SlidersHero, slidersSummary } from "./sections/sliders"
import { SpaceSection, SpaceHero, spaceSummary } from "./sections/space"
import { SpinnerSection, SpinnerHero, spinnerSummary } from "./sections/spinner"
import {
  SurfacesSection,
  SurfacesHero,
  surfacesSummary,
} from "./sections/surfaces"
import { SwitchSection, SwitchHero, switchSummary } from "./sections/switch"
import { TablesSection, TablesHero, tablesSummary } from "./sections/tables"
import { TabsSection, TabsHero, tabsSummary } from "./sections/tabs"
import { TogglesSection, ToggleHero, togglesSummary } from "./sections/toggles"
import {
  TooltipsSection,
  TooltipsHero,
  tooltipsSummary,
} from "./sections/tooltips"
import { TypeHero, TypeSection, typeSummary } from "./sections/type"

export { DEFAULTS }
export type { StudioState } from "./axes"
import type { Studio } from "./use-studio"

export type { Studio }

export interface Chapter {
  id: string
  label: string
  defaults: Partial<StudioState>
  Body: React.ComponentType<{ studio: Studio }>
  /** The always-visible specimen atop the stack. Optional only for Color,
   *  whose rows are the specimen. */
  Hero?: React.ComponentType<{ state: StudioState }>
  /** The collapsed row's live value summary. */
  summary: (state: StudioState) => string
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
    Hero: TypeHero,
    summary: typeSummary,
  },
  {
    id: "icons",
    label: "Icons",
    defaults: ICON_DEFAULTS,
    Body: IconsSection,
    Hero: IconsHero,
    summary: iconsSummary,
  },
  {
    id: "shape",
    label: "Shape",
    defaults: SHAPE_DEFAULTS,
    Body: ShapeSection,
    Hero: ShapeHero,
    summary: shapeSummary,
  },
  {
    id: "space",
    label: "Space",
    defaults: SPACE_DEFAULTS,
    Body: SpaceSection,
    Hero: SpaceHero,
    summary: spaceSummary,
  },
  {
    id: "surfaces",
    label: "Surfaces",
    defaults: SURFACE_DEFAULTS,
    Body: SurfacesSection,
    Hero: SurfacesHero,
    summary: surfacesSummary,
  },
  {
    id: "focus",
    label: "Focus",
    defaults: FOCUS_DEFAULTS,
    Body: FocusSection,
    Hero: FocusHero,
    summary: focusSummary,
  },
  {
    id: "cursor",
    label: "Cursor",
    defaults: CURSOR_DEFAULTS,
    Body: CursorSection,
    Hero: CursorHero,
    summary: cursorSummary,
  },
  {
    id: "selection",
    label: "Text selection",
    defaults: SELECTION_DEFAULTS,
    Body: SelectionSection,
    Hero: SelectionHero,
    summary: selectionSummary,
  },
  {
    id: "scrollbars",
    label: "Scrollbars",
    defaults: SCROLLBAR_DEFAULTS,
    Body: ScrollbarsSection,
    Hero: ScrollbarsHero,
    summary: scrollbarsSummary,
  },
  {
    id: "disabled",
    label: "Disabled",
    defaults: DISABLED_DEFAULTS,
    Body: DisabledSection,
    Hero: DisabledHero,
    summary: disabledSummary,
  },
  {
    id: "invalid",
    label: "Invalid",
    defaults: INVALID_DEFAULTS,
    Body: InvalidSection,
    Hero: InvalidHero,
    summary: invalidSummary,
  },
  {
    id: "charts",
    label: "Charts",
    defaults: CHART_DEFAULTS,
    Body: ChartsSection,
    Hero: ChartsHero,
    summary: chartsSummary,
  },
  {
    id: "motion",
    label: "Motion",
    defaults: MOTION_DEFAULTS,
    Body: MotionSection,
    Hero: MotionHero,
    summary: motionSummary,
  },
  {
    id: "mobile",
    label: "Mobile",
    defaults: MOBILE_DEFAULTS,
    Body: MobileSection,
    Hero: MobileHero,
    summary: mobileSummary,
  },
  {
    id: "links",
    label: "Links",
    defaults: LINK_DEFAULTS,
    Body: LinksSection,
    Hero: LinksHero,
    summary: linksSummary,
  },
  {
    id: "notices",
    label: "Notices",
    defaults: NOTICE_DEFAULTS,
    Body: NoticesSection,
    Hero: NoticesHero,
    summary: noticesSummary,
  },
  {
    id: "skeleton",
    label: "Skeleton",
    defaults: SKELETON_DEFAULTS,
    Body: SkeletonSection,
    Hero: SkeletonHero,
    summary: skeletonSummary,
  },
  {
    id: "spinner",
    label: "Spinner",
    defaults: SPINNER_DEFAULTS,
    Body: SpinnerSection,
    Hero: SpinnerHero,
    summary: spinnerSummary,
  },
  {
    id: "progress",
    label: "Progress",
    defaults: PROGRESS_DEFAULTS,
    Body: ProgressSection,
    Hero: ProgressHero,
    summary: progressSummary,
  },
  {
    id: "buttons",
    label: "Buttons",
    defaults: BUTTON_DEFAULTS,
    Body: ButtonsSection,
    Hero: ButtonsHero,
    summary: buttonsSummary,
  },
  {
    id: "button-groups",
    label: "Button groups",
    defaults: BUTTON_GROUP_DEFAULTS,
    Body: ButtonGroupsSection,
    Hero: ButtonGroupHero,
    summary: buttonGroupsSummary,
  },
  {
    id: "toggles",
    label: "Toggles",
    defaults: TOGGLE_DEFAULTS,
    Body: TogglesSection,
    Hero: ToggleHero,
    summary: togglesSummary,
  },
  {
    id: "segmented-control",
    label: "Segmented control",
    defaults: SEGMENTED_DEFAULTS,
    Body: SegmentedControlSection,
    Hero: SegmentedHero,
    summary: segmentedControlSummary,
  },
  {
    id: "switch",
    label: "Switch",
    defaults: SWITCH_DEFAULTS,
    Body: SwitchSection,
    Hero: SwitchHero,
    summary: switchSummary,
  },
  {
    id: "checkbox",
    label: "Checkbox",
    defaults: CHECKBOX_DEFAULTS,
    Body: CheckboxSection,
    Hero: CheckboxHero,
    summary: checkboxSummary,
  },
  {
    id: "radio",
    label: "Radio",
    defaults: RADIO_DEFAULTS,
    Body: RadioSection,
    Hero: RadioHero,
    summary: radioSummary,
  },
  {
    id: "choice-cards",
    label: "Choice cards",
    defaults: CHOICE_CARD_DEFAULTS,
    Body: ChoiceCardsSection,
    Hero: ChoiceCardsHero,
    summary: choiceCardsSummary,
  },
  {
    id: "inputs",
    label: "Inputs",
    defaults: INPUT_DEFAULTS,
    Body: InputsSection,
    Hero: FieldHero,
    summary: inputsSummary,
  },
  {
    id: "input-groups",
    label: "Input groups",
    defaults: INPUT_GROUP_DEFAULTS,
    Body: InputGroupsSection,
    Hero: AddonsHero,
    summary: inputGroupsSummary,
  },
  {
    id: "number-field",
    label: "Number field",
    defaults: NUMBER_FIELD_DEFAULTS,
    Body: NumberFieldSection,
    Hero: NumberHero,
    summary: numberFieldSummary,
  },
  {
    id: "otp-field",
    label: "OTP field",
    defaults: OTP_FIELD_DEFAULTS,
    Body: OtpFieldSection,
    Hero: OtpHero,
    summary: otpFieldSummary,
  },
  {
    id: "pickers",
    label: "Pickers",
    defaults: PICKER_DEFAULTS,
    Body: PickersSection,
    Hero: PickersHero,
    summary: pickersSummary,
  },
  {
    id: "calendar",
    label: "Calendar",
    defaults: CALENDAR_DEFAULTS,
    Body: CalendarSection,
    Hero: CalendarHero,
    summary: calendarSummary,
  },
  {
    id: "sliders",
    label: "Sliders",
    defaults: SLIDER_DEFAULTS,
    Body: SlidersSection,
    Hero: SlidersHero,
    summary: slidersSummary,
  },
  {
    id: "menus",
    label: "Menus",
    defaults: MENU_DEFAULTS,
    Body: MenusSection,
    Hero: MenusHero,
    summary: menusSummary,
  },
  {
    id: "dialogs",
    label: "Dialogs",
    defaults: DIALOG_DEFAULTS,
    Body: DialogsSection,
    Hero: DialogsHero,
    summary: dialogsSummary,
  },
  {
    id: "popovers",
    label: "Popovers",
    defaults: POPOVER_DEFAULTS,
    Body: PopoversSection,
    Hero: PopoversHero,
    summary: popoversSummary,
  },
  {
    id: "tooltips",
    label: "Tooltips",
    defaults: TOOLTIP_DEFAULTS,
    Body: TooltipsSection,
    Hero: TooltipsHero,
    summary: tooltipsSummary,
  },
  {
    id: "tabs",
    label: "Tabs",
    defaults: TAB_DEFAULTS,
    Body: TabsSection,
    Hero: TabsHero,
    summary: tabsSummary,
  },
  {
    id: "accordion",
    label: "Accordion",
    defaults: ACCORDION_DEFAULTS,
    Body: AccordionSection,
    Hero: AccordionHero,
    summary: accordionSummary,
  },
  {
    id: "breadcrumbs",
    label: "Breadcrumbs",
    defaults: BREADCRUMB_DEFAULTS,
    Body: BreadcrumbsSection,
    Hero: BreadcrumbsHero,
    summary: breadcrumbsSummary,
  },
  {
    id: "pagination",
    label: "Pagination",
    defaults: PAGINATION_DEFAULTS,
    Body: PaginationSection,
    Hero: PaginationHero,
    summary: paginationSummary,
  },
  {
    id: "badges",
    label: "Badges",
    defaults: BADGE_DEFAULTS,
    Body: BadgesSection,
    Hero: BadgesHero,
    summary: badgesSummary,
  },
  {
    id: "kbd",
    label: "Kbd",
    defaults: KBD_DEFAULTS,
    Body: KbdSection,
    Hero: KbdHero,
    summary: kbdSummary,
  },
  {
    id: "avatars",
    label: "Avatars",
    defaults: AVATAR_DEFAULTS,
    Body: AvatarsSection,
    Hero: AvatarsHero,
    summary: avatarsSummary,
  },
  {
    id: "tables",
    label: "Tables",
    defaults: TABLE_DEFAULTS,
    Body: TablesSection,
    Hero: TablesHero,
    summary: tablesSummary,
  },
]
