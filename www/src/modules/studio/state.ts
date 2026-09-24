"use client"

/* The panel's composition root: the chapter list, in page order. Each
   section in sections/ owns its body; its axes live in axes/. */

import type { StudioState } from "./axes"
import { BrowserPreview, BrowserSection } from "./sections/browser"
import { ColorPreview, ColorPrimary, ColorSection } from "./sections/color"
import { ComponentsSection } from "./sections/components"
import { IconsPreview, IconsSection } from "./sections/icons"
import { MobilePreview, MobileSection } from "./sections/mobile"
import { MotionPreview, MotionSection } from "./sections/motion"
import { ShapePreview, ShapeSection } from "./sections/shape"
import { SpacePreview, SpaceSection } from "./sections/space"
import { StatesPreview, StatesSection } from "./sections/states"
import { SurfacesPreview, SurfacesSection } from "./sections/surfaces"
import { TypePreview, TypeSection } from "./sections/type"

export type { StudioState } from "./axes"
import type { Studio } from "./use-studio"

export type { Studio }

export interface Chapter {
  id: string
  label: string
  /** The rows on the page: the chapter's two or three decisions that matter. */
  Primary?: React.ComponentType<{ studio: Studio }>
  /** The rest of the chapter. */
  Body: React.ComponentType<{ studio: Studio }>
  /** A glyph-sized specimen of the chapter's state, beside its title. */
  Preview?: React.ComponentType<{ state: StudioState }>
}

/* Identity first, then the page chrome and the treatments every control
   wears, then every component behind one row each. Alert and Toast have no
   axes yet and stay off the page until they are rebuilt from preset evidence. */
export const CHAPTERS: Chapter[] = [
  {
    id: "color",
    label: "Color",
    Primary: ColorPrimary,
    Body: ColorSection,
    Preview: ColorPreview,
  },
  {
    id: "typography",
    label: "Typography",
    Body: TypeSection,
    Preview: TypePreview,
  },
  {
    id: "icons",
    label: "Icons",
    Body: IconsSection,
    Preview: IconsPreview,
  },
  {
    id: "shape",
    label: "Shape",
    Body: ShapeSection,
    Preview: ShapePreview,
  },
  {
    id: "space",
    label: "Space",
    Body: SpaceSection,
    Preview: SpacePreview,
  },
  {
    id: "surfaces",
    label: "Surfaces",
    Body: SurfacesSection,
    Preview: SurfacesPreview,
  },
  {
    id: "browser",
    label: "Browser",
    Body: BrowserSection,
    Preview: BrowserPreview,
  },
  {
    id: "states",
    label: "States",
    Body: StatesSection,
    Preview: StatesPreview,
  },
  {
    id: "motion",
    label: "Motion",
    Body: MotionSection,
    Preview: MotionPreview,
  },
  {
    id: "mobile",
    label: "Mobile",
    Body: MobileSection,
    Preview: MobilePreview,
  },
  {
    id: "components",
    label: "Components",
    Body: ComponentsSection,
  },
]
