"use client"

/* The panel's composition root: the chapter list, and the design-system state
   it reads. Each section in sections/ owns its own axes — its defaults, its
   options, its body — and this file only orders them into a panel.

   A section's defaults slice IS its state slice: it's what the chapter card
   diffs to show "modified", and what Reset writes back. Adding an axis means
   adding a key to that one section's defaults; nothing here changes. */

import {
  ButtonGroupsSection,
  BUTTON_GROUP_DEFAULTS,
} from "./sections/button-groups"
import { ButtonsSection, BUTTON_DEFAULTS } from "./sections/buttons"
import { ColorSection, COLOR_DEFAULTS } from "./sections/color"
import { CursorSection, CURSOR_DEFAULTS } from "./sections/cursor"
import { FocusSection, FOCUS_DEFAULTS } from "./sections/focus"
import { IconsSection, ICON_DEFAULTS } from "./sections/icons"
import {
  InputGroupsSection,
  INPUT_GROUP_DEFAULTS,
} from "./sections/input-groups"
import { InputsSection, INPUT_DEFAULTS } from "./sections/inputs"
import { MotionSection, MOTION_DEFAULTS } from "./sections/motion"
import { NoticesSection, NOTICE_DEFAULTS } from "./sections/notices"
import {
  NumberFieldSection,
  NUMBER_FIELD_DEFAULTS,
} from "./sections/number-field"
import { OtpFieldSection, OTP_FIELD_DEFAULTS } from "./sections/otp-field"
import { SelectionSection, SELECTION_DEFAULTS } from "./sections/selection"
import { ShapeSection, SHAPE_DEFAULTS } from "./sections/shape"
import { SkeletonSection, SKELETON_DEFAULTS } from "./sections/skeleton"
import { SpaceSection, SPACE_DEFAULTS } from "./sections/space"
import { SpinnerSection, SPINNER_DEFAULTS } from "./sections/spinner"
import { SurfacesSection, SURFACE_DEFAULTS } from "./sections/surfaces"
import { TogglesSection, TOGGLE_DEFAULTS } from "./sections/toggles"
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
  ...MOTION_DEFAULTS,
  ...NOTICE_DEFAULTS,
  ...SKELETON_DEFAULTS,
  ...SPINNER_DEFAULTS,
  ...BUTTON_DEFAULTS,
  ...BUTTON_GROUP_DEFAULTS,
  ...TOGGLE_DEFAULTS,
  ...INPUT_DEFAULTS,
  ...INPUT_GROUP_DEFAULTS,
  ...NUMBER_FIELD_DEFAULTS,
  ...OTP_FIELD_DEFAULTS,
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
    id: "motion",
    label: "Motion",
    defaults: MOTION_DEFAULTS,
    Body: MotionSection,
  },
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
]
