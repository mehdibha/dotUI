"use client"

/* The panel's composition root: the chapter list, in page order, and the
   design-system state it reads. Each section in sections/ owns its own axes —
   its defaults, its options, its body — and this file only orders them into
   a panel.

   A section's defaults slice IS its state slice: it's what the chapter diffs
   to show "modified", and what Reset writes back. Adding an axis means adding
   a key to that one section's defaults; nothing here changes. */

import { DEFAULTS } from "./axes"
import type { StudioState } from "./axes"
import { COLOR_DEFAULTS } from "./axes/color"
import { CURSOR_DEFAULTS } from "./axes/cursor"
import { DISABLED_DEFAULTS } from "./axes/disabled"
import { FOCUS_DEFAULTS } from "./axes/focus"
import { ICON_DEFAULTS } from "./axes/icons"
import { INVALID_DEFAULTS } from "./axes/invalid"
import { MOBILE_DEFAULTS } from "./axes/mobile"
import { MOTION_DEFAULTS } from "./axes/motion"
import { SELECTION_DEFAULTS } from "./axes/selection"
import { SHAPE_DEFAULTS } from "./axes/shape"
import { SPACE_DEFAULTS } from "./axes/space"
import { SURFACE_DEFAULTS } from "./axes/surfaces"
import { TYPE_DEFAULTS } from "./axes/type"
import { BrowserSection } from "./sections/browser"
import { ColorPrimary, ColorSection } from "./sections/color"
import { COMPONENTS_DEFAULTS, ComponentsSection } from "./sections/components"
import { IconsSection } from "./sections/icons"
import { MobileSection } from "./sections/mobile"
import { MotionSection } from "./sections/motion"
import { ShapeSection } from "./sections/shape"
import { SpaceSection } from "./sections/space"
import { StatesSection } from "./sections/states"
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
  /** The rows that lead the group. */
  Primary?: React.ComponentType<{ studio: Studio }>
  /** The rest of the group. */
  Body: React.ComponentType<{ studio: Studio }>
}

/* Identity first, then the treatments every control wears, then every
   component behind one row each. Alert and Toast have no axes yet and stay
   off the page until they are rebuilt from preset evidence. */
export const CHAPTERS: Chapter[] = [
  {
    id: "color",
    label: "Color",
    defaults: { ...COLOR_DEFAULTS, ...SURFACE_DEFAULTS },
    Primary: ColorPrimary,
    Body: ColorSection,
  },
  {
    id: "fonts",
    label: "Fonts",
    defaults: TYPE_DEFAULTS,
    Body: TypeSection,
  },
  {
    id: "icons",
    label: "Icons",
    defaults: ICON_DEFAULTS,
    Body: IconsSection,
  },
  {
    id: "radius",
    label: "Radius",
    defaults: SHAPE_DEFAULTS,
    Body: ShapeSection,
  },
  {
    id: "density",
    label: "Density",
    defaults: SPACE_DEFAULTS,
    Body: SpaceSection,
  },
  {
    id: "states",
    label: "States",
    defaults: { ...FOCUS_DEFAULTS, ...DISABLED_DEFAULTS, ...INVALID_DEFAULTS },
    Body: StatesSection,
  },
  {
    id: "cursor",
    label: "Cursor",
    defaults: { ...CURSOR_DEFAULTS, ...SELECTION_DEFAULTS },
    Body: BrowserSection,
  },
  {
    id: "motion",
    label: "Motion",
    defaults: MOTION_DEFAULTS,
    Body: MotionSection,
  },
  {
    id: "mobile",
    label: "Mobile",
    defaults: MOBILE_DEFAULTS,
    Body: MobileSection,
  },
  {
    id: "components",
    label: "Components",
    defaults: COMPONENTS_DEFAULTS,
    Body: ComponentsSection,
  },
]
