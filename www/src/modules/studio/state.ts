"use client"

/* The panel's composition root: the chapter list, in page order. Each
   section in sections/ owns its body; its axes live in axes/. */

import type { StudioState } from "./axes"
import { ColorPreview, ColorPrimary, ColorSection } from "./sections/color"
import { COMPONENT_PAGES, ComponentsSection } from "./sections/components"
import { IconsPreview, IconsSection } from "./sections/icons"
import {
  InteractivityPreview,
  InteractivitySection,
} from "./sections/interactivity"
import { MobilePreview, MobileSection } from "./sections/mobile"
import { MotionSection } from "./sections/motion"
import { ShapePreview, ShapeSection } from "./sections/shape"
import { SpacePreview, SpaceSection } from "./sections/space"
import { StatesPreview, StatesSection } from "./sections/states"
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
  /** Pages the body's rows open in place of the panel page. */
  pages?: ChapterPage[]
  /** Registry items styled here, for the preview's inspector. */
  components?: string[]
}

export interface ChapterPage {
  id: string
  label: string
  Preview?: React.ComponentType<{ state: StudioState }>
  Body: React.ComponentType<{ studio: Studio }>
  components?: string[]
}

/* Identity first, then interactivity and the treatments every control
   wears, then every component behind one row each. Alert has no axes yet
   and stays off the page until it is rebuilt from preset evidence. */
export const CHAPTERS: Chapter[] = [
  {
    id: "color",
    label: "Color",
    Primary: ColorPrimary,
    Body: ColorSection,
    Preview: ColorPreview,
    components: ["card"],
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
    label: "Density",
    Body: SpaceSection,
    Preview: SpacePreview,
  },
  {
    id: "interactivity",
    label: "Interactivity",
    Body: InteractivitySection,
    Preview: InteractivityPreview,
  },
  {
    id: "states",
    label: "States",
    Body: StatesSection,
    Preview: StatesPreview,
    components: ["field"],
  },
  {
    id: "motion",
    label: "Motion",
    Body: MotionSection,
    components: ["toast"],
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
    pages: COMPONENT_PAGES,
  },
]
