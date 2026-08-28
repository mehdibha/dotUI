"use client"

/* Card illustrations — the React Aria anatomy school (see demos/ink.tsx):
   each index card carries a stateless monochrome miniature of its chapter's
   subject instead of a live specimen. Inert by design (span/svg-based,
   pointer-events-none wrapper) — the card itself is the pressable. Only
   Color stays wired to state: its subject IS the brand seed. */

import { PlusIcon } from "lucide-react"

import type { LabState } from "../state"
import {
  CheckboxDemo,
  ChoiceCardsDemo,
  KbdDemo,
  RadioDemo,
  SwitchDemo,
} from "./demos/actions"
import {
  AvatarsDemo,
  BadgesDemo,
  ChartsDemo,
  NoticesDemo,
  ProgressDemo,
  SkeletonDemo,
  SpinnerDemo,
  TablesDemo,
} from "./demos/display"
import { CalendarDemo, PickersDemo, SlidersDemo } from "./demos/fields"
import {
  ColorDemo,
  CursorDemo,
  DisabledDemo,
  FocusDemo,
  IconsDemo,
  InvalidDemo,
  LinksDemo,
  MotionDemo,
  ScrollbarsDemo,
  SelectionDemo,
  ShapeDemo,
  SpaceDemo,
  SurfacesDemo,
  TypographyDemo,
} from "./demos/foundations"
import {
  AccordionDemo,
  BreadcrumbsDemo,
  DialogsDemo,
  MenusDemo,
  PaginationDemo,
  PopoversDemo,
  TabsDemo,
  TooltipsDemo,
} from "./demos/overlays"

/** The pair: tonal icon button beside the solid Save. */
function ButtonsDemo() {
  return (
    <span className="flex shrink-0 items-center gap-1.5">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-fg/10">
        <PlusIcon className="size-3.5 text-fg/70" />
      </span>
      <span className="flex h-7 shrink-0 items-center rounded-lg bg-fg/10 px-2.5 text-[11px] font-medium whitespace-nowrap text-fg/70">
        Save
      </span>
    </span>
  )
}

/** An empty field: caret ahead of its placeholder. */
function InputsDemo() {
  return (
    <span className="flex h-7 w-28 shrink-0 items-center gap-1 rounded-lg border border-fg/30 px-2.5">
      <span className="h-3 w-px shrink-0 bg-fg/70" />
      <span className="truncate text-[11px] text-fg/45">Email address</span>
    </span>
  )
}

/** Every index card carries an illustration — one grammar for the whole
 *  index. Keyed by index-chapter id (composites included). */
export const CARD_DEMOS: Record<
  string,
  React.ComponentType<{ state: LabState }>
> = {
  color: ColorDemo,
  typography: TypographyDemo,
  icons: IconsDemo,
  shape: ShapeDemo,
  space: SpaceDemo,
  surfaces: SurfacesDemo,
  cursor: CursorDemo,
  selection: SelectionDemo,
  scrollbars: ScrollbarsDemo,
  focus: FocusDemo,
  invalid: InvalidDemo,
  disabled: DisabledDemo,
  motion: MotionDemo,
  links: LinksDemo,
  buttons: ButtonsDemo,
  inputs: InputsDemo,
  switch: SwitchDemo,
  checkbox: CheckboxDemo,
  radio: RadioDemo,
  "choice-cards": ChoiceCardsDemo,
  pickers: PickersDemo,
  calendar: CalendarDemo,
  sliders: SlidersDemo,
  menus: MenusDemo,
  dialogs: DialogsDemo,
  popovers: PopoversDemo,
  tooltips: TooltipsDemo,
  tabs: TabsDemo,
  breadcrumbs: BreadcrumbsDemo,
  pagination: PaginationDemo,
  notices: NoticesDemo,
  skeleton: SkeletonDemo,
  spinner: SpinnerDemo,
  progress: ProgressDemo,
  badges: BadgesDemo,
  kbd: KbdDemo,
  avatars: AvatarsDemo,
  tables: TablesDemo,
  accordion: AccordionDemo,
  charts: ChartsDemo,
}
