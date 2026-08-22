"use client"

/* The panel's composition root: the chapter list, and the design-system state
   it reads. Each section in sections/ owns its own axes — its defaults, its
   options, its body — and this file only orders them into a panel.

   A section's defaults slice IS its state slice: it's what the chapter card
   diffs to show "modified", and what Reset writes back. Adding an axis means
   adding a key to that one section's defaults; nothing here changes. */

import {
  AccordionSection,
  ACCORDION_DEFAULTS,
  AccordionHero,
  accordionSummary,
} from "./sections/accordion"
import {
  AvatarsSection,
  AVATAR_DEFAULTS,
  AvatarsHero,
  avatarsSummary,
} from "./sections/avatars"
import {
  BadgesSection,
  BADGE_DEFAULTS,
  BadgesHero,
  badgesSummary,
} from "./sections/badges"
import {
  BreadcrumbsSection,
  BREADCRUMB_DEFAULTS,
  BreadcrumbsHero,
  breadcrumbsSummary,
} from "./sections/breadcrumbs"
import {
  ButtonGroupsSection,
  BUTTON_GROUP_DEFAULTS,
  ButtonGroupHero,
  buttonGroupsSummary,
} from "./sections/button-groups"
import {
  ButtonsHero,
  ButtonsSection,
  buttonsSummary,
  BUTTON_DEFAULTS,
} from "./sections/buttons"
import {
  CalendarSection,
  CALENDAR_DEFAULTS,
  CalendarHero,
  calendarSummary,
} from "./sections/calendar"
import {
  CheckboxSection,
  CHECKBOX_DEFAULTS,
  CheckboxHero,
  checkboxSummary,
} from "./sections/checkbox"
import {
  ChoiceCardsSection,
  CHOICE_CARD_DEFAULTS,
  ChoiceCardsHero,
  choiceCardsSummary,
} from "./sections/choice-cards"
import { ColorSection, COLOR_DEFAULTS, colorSummary } from "./sections/color"
import {
  CursorSection,
  CURSOR_DEFAULTS,
  CursorHero,
  cursorSummary,
} from "./sections/cursor"
import {
  DialogsSection,
  DIALOG_DEFAULTS,
  DialogsHero,
  dialogsSummary,
} from "./sections/dialogs"
import {
  DisabledSection,
  DISABLED_DEFAULTS,
  DisabledHero,
  disabledSummary,
} from "./sections/disabled"
import {
  FocusSection,
  FOCUS_DEFAULTS,
  FocusHero,
  focusSummary,
} from "./sections/focus"
import {
  IconsHero,
  IconsSection,
  iconsSummary,
  ICON_DEFAULTS,
} from "./sections/icons"
import {
  InputGroupsSection,
  INPUT_GROUP_DEFAULTS,
  AddonsHero,
  inputGroupsSummary,
} from "./sections/input-groups"
import {
  FieldHero,
  InputsSection,
  inputsSummary,
  INPUT_DEFAULTS,
} from "./sections/inputs"
import { KbdSection, KBD_DEFAULTS, KbdHero, kbdSummary } from "./sections/kbd"
import {
  LinksSection,
  LINK_DEFAULTS,
  LinksHero,
  linksSummary,
} from "./sections/links"
import {
  MenusHero,
  MenusSection,
  menusSummary,
  MENU_DEFAULTS,
} from "./sections/menus"
import {
  MotionSection,
  MOTION_DEFAULTS,
  MotionHero,
  motionSummary,
} from "./sections/motion"
import {
  NoticesSection,
  NOTICE_DEFAULTS,
  NoticesHero,
  noticesSummary,
} from "./sections/notices"
import {
  NumberFieldSection,
  NUMBER_FIELD_DEFAULTS,
  NumberHero,
  numberFieldSummary,
} from "./sections/number-field"
import {
  OtpFieldSection,
  OTP_FIELD_DEFAULTS,
  OtpHero,
  otpFieldSummary,
} from "./sections/otp-field"
import {
  PaginationSection,
  PAGINATION_DEFAULTS,
  PaginationHero,
  paginationSummary,
} from "./sections/pagination"
import {
  PickersSection,
  PICKER_DEFAULTS,
  PickersHero,
  pickersSummary,
} from "./sections/pickers"
import {
  PopoversSection,
  POPOVER_DEFAULTS,
  PopoversHero,
  popoversSummary,
} from "./sections/popovers"
import {
  ProgressSection,
  PROGRESS_DEFAULTS,
  ProgressHero,
  progressSummary,
} from "./sections/progress"
import {
  RadioSection,
  RADIO_DEFAULTS,
  RadioHero,
  radioSummary,
} from "./sections/radio"
import {
  ScrollbarsSection,
  SCROLLBAR_DEFAULTS,
  ScrollbarsHero,
  scrollbarsSummary,
} from "./sections/scrollbars"
import {
  SegmentedControlSection,
  SEGMENTED_DEFAULTS,
  SegmentedHero,
  segmentedControlSummary,
} from "./sections/segmented-control"
import {
  SelectionSection,
  SELECTION_DEFAULTS,
  SelectionHero,
  selectionSummary,
} from "./sections/selection"
import {
  ShapeHero,
  ShapeSection,
  shapeSummary,
  SHAPE_DEFAULTS,
} from "./sections/shape"
import {
  SkeletonSection,
  SKELETON_DEFAULTS,
  SkeletonHero,
  skeletonSummary,
} from "./sections/skeleton"
import {
  SlidersSection,
  SLIDER_DEFAULTS,
  SlidersHero,
  slidersSummary,
} from "./sections/sliders"
import {
  SpaceSection,
  SPACE_DEFAULTS,
  SpaceHero,
  spaceSummary,
} from "./sections/space"
import {
  SpinnerSection,
  SPINNER_DEFAULTS,
  SpinnerHero,
  spinnerSummary,
} from "./sections/spinner"
import {
  SurfacesSection,
  SURFACE_DEFAULTS,
  SurfacesHero,
  surfacesSummary,
} from "./sections/surfaces"
import {
  SwitchSection,
  SWITCH_DEFAULTS,
  SwitchHero,
  switchSummary,
} from "./sections/switch"
import {
  TablesSection,
  TABLE_DEFAULTS,
  TablesHero,
  tablesSummary,
} from "./sections/tables"
import {
  TabsSection,
  TAB_DEFAULTS,
  TabsHero,
  tabsSummary,
} from "./sections/tabs"
import {
  TogglesSection,
  TOGGLE_DEFAULTS,
  ToggleHero,
  togglesSummary,
} from "./sections/toggles"
import {
  TooltipsSection,
  TOOLTIP_DEFAULTS,
  TooltipsHero,
  tooltipsSummary,
} from "./sections/tooltips"
import {
  TypeHero,
  TypeSection,
  typeSummary,
  TYPE_DEFAULTS,
} from "./sections/type"

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
  /** The always-visible specimen atop the stack. Optional only for Color,
   *  whose rows are the specimen. */
  Hero?: React.ComponentType<{ state: LabState }>
  /** The collapsed row's live value summary. */
  summary: (state: LabState) => string
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
    label: "Selection",
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
    id: "motion",
    label: "Motion",
    defaults: MOTION_DEFAULTS,
    Body: MotionSection,
    Hero: MotionHero,
    summary: motionSummary,
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
