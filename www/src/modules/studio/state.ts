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
import { SCROLLBAR_DEFAULTS } from "./axes/scrollbars"
import { SELECTION_DEFAULTS } from "./axes/selection"
import { SHAPE_DEFAULTS } from "./axes/shape"
import { SPACE_DEFAULTS } from "./axes/space"
import { SURFACE_DEFAULTS } from "./axes/surfaces"
import { TYPE_DEFAULTS } from "./axes/type"
import { BrowserPreview, BrowserSection } from "./sections/browser"
import { ColorPreview, ColorPrimary, ColorSection } from "./sections/color"
import { COMPONENTS_DEFAULTS, ComponentsSection } from "./sections/components"
import { IconsPreview, IconsSection } from "./sections/icons"
import { MobilePreview, MobileSection } from "./sections/mobile"
import { MOTION_DEFAULTS, MotionSection } from "./sections/motion"
import { ShapePreview, ShapeSection } from "./sections/shape"
import { SpacePreview, SpaceSection } from "./sections/space"
import { StatesPreview, StatesSection } from "./sections/states"
import { SurfacesPreview, SurfacesSection } from "./sections/surfaces"
import { TypePreview, TypeSection } from "./sections/type"

export { DEFAULTS }
export type { StudioState } from "./axes"
import type { Studio } from "./use-studio"

export type { Studio }

export interface Chapter {
  id: string
  label: string
  defaults: Partial<StudioState>
  /** The rows on the page: the chapter's two or three decisions that matter. */
  Primary?: React.ComponentType<{ studio: Studio }>
  /** The rest of the chapter. */
  Body: React.ComponentType<{ studio: Studio }>
  /** A glyph-sized specimen of the chapter's state, beside its title. */
  Preview?: React.ComponentType<{ state: StudioState }>
}

/* Identity first, then the page chrome and the treatments every control
   wears, then every component behind one row each. Alert has no axes yet
   and stays off the page until it is rebuilt from preset evidence. */
export const CHAPTERS: Chapter[] = [
  {
    id: "color",
    label: "Color",
    defaults: COLOR_DEFAULTS,
    Primary: ColorPrimary,
    Body: ColorSection,
    Preview: ColorPreview,
  },
  {
    id: "typography",
    label: "Typography",
    defaults: TYPE_DEFAULTS,
    Body: TypeSection,
    Preview: TypePreview,
  },
  {
    id: "icons",
    label: "Icons",
    defaults: ICON_DEFAULTS,
    Body: IconsSection,
    Preview: IconsPreview,
  },
  {
    id: "shape",
    label: "Shape",
    defaults: SHAPE_DEFAULTS,
    Body: ShapeSection,
    Preview: ShapePreview,
  },
  {
    id: "space",
    label: "Space",
    defaults: SPACE_DEFAULTS,
    Body: SpaceSection,
    Preview: SpacePreview,
  },
  {
    id: "surfaces",
    label: "Surfaces",
    defaults: SURFACE_DEFAULTS,
    Body: SurfacesSection,
    Preview: SurfacesPreview,
  },
  {
    id: "browser",
    label: "Browser",
    defaults: {
      ...CURSOR_DEFAULTS,
      ...SELECTION_DEFAULTS,
      ...SCROLLBAR_DEFAULTS,
    },
    Body: BrowserSection,
    Preview: BrowserPreview,
  },
  {
    id: "states",
    label: "States",
    defaults: { ...FOCUS_DEFAULTS, ...DISABLED_DEFAULTS, ...INVALID_DEFAULTS },
    Body: StatesSection,
    Preview: StatesPreview,
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
    Preview: MobilePreview,
  },
  {
    id: "components",
    label: "Components",
    defaults: COMPONENTS_DEFAULTS,
    Body: ComponentsSection,
  },
]
