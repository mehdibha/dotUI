"use client"

/* Motion — every animated component's timing in one place, folded to a row
   each. Each row is the same control the component's own section shows,
   on the same state; there is no system-wide motion to set. */

import { DEFAULTS } from "../axes"
import {
  AccordionMotion,
  ButtonMotion,
  CalendarMotion,
  CheckboxMotion,
  DrawerMotion,
  InputMotion,
  LinkMotion,
  ModalMotion,
  PopoverMotion,
  ProgressMotion,
  SegmentedControlMotion,
  SidebarMotion,
  SliderMotion,
  SwitchMotion,
  TabsMotion,
  TagMotion,
  ToastMotion,
  TooltipMotion,
} from "../motion-controls"
import { GroupTitle } from "../rows"
import type { Studio, StudioState } from "../state"

/** Every `<component>Motion` key. */
export const MOTION_DEFAULTS: Partial<StudioState> = Object.fromEntries(
  Object.entries(DEFAULTS).filter(([key]) => key.endsWith("Motion")),
)

export function MotionSection({ studio }: { studio: Studio }) {
  return (
    <>
      <GroupTitle>Overlays</GroupTitle>
      <PopoverMotion label="Popover" studio={studio} defaultOpen={false} />
      <TooltipMotion label="Tooltip" studio={studio} defaultOpen={false} />
      <ModalMotion label="Dialog" studio={studio} defaultOpen={false} />
      <DrawerMotion label="Drawer" studio={studio} defaultOpen={false} />
      <ToastMotion label="Toast" studio={studio} defaultOpen={false} />
      <GroupTitle>Disclosure</GroupTitle>
      <AccordionMotion label="Accordion" studio={studio} defaultOpen={false} />
      <SidebarMotion title="Sidebar" label="Collapse" studio={studio} />
      <GroupTitle>Indicators</GroupTitle>
      <TabsMotion title="Tabs" label="Transition" studio={studio} />
      <SegmentedControlMotion
        title="Segmented control"
        label="Transition"
        studio={studio}
      />
      <SwitchMotion title="Switch" label="Transition" studio={studio} />
      <ProgressMotion title="Progress" label="Fill" studio={studio} />
      <GroupTitle>Controls</GroupTitle>
      <ButtonMotion title="Buttons" label="Transition" studio={studio} />
      <CheckboxMotion
        title="Checkbox & radio"
        label="Transition"
        studio={studio}
      />
      <InputMotion title="Inputs" label="Transition" studio={studio} />
      <SliderMotion title="Slider" label="Transition" studio={studio} />
      <LinkMotion title="Links" label="Transition" studio={studio} />
      <TagMotion title="Tags" label="Transition" studio={studio} />
      <CalendarMotion title="Calendar" label="Transition" studio={studio} />
    </>
  )
}
