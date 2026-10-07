"use client"

/* The panel's chapters, in page order. */

import { KEY_OWNER } from "./axes"
import type { Effective } from "./axes"
import { PRIMARY_LEAVES } from "./axes/color"
import { ColorPreview, ColorPrimary, ColorSection } from "./sections/color"
import { COMPONENT_PAGES, ComponentsSection } from "./sections/components"
import { IconsPreview, IconsSection } from "./sections/icons"
import { MotionPreview, MotionSection } from "./sections/motion"
import { ShapePreview, ShapeSection } from "./sections/shape"
import { SpacePreview, SpaceSection } from "./sections/space"
import { StatesPreview, StatesSection } from "./sections/states"
import { TypePreview, TypeSection } from "./sections/type"

export type { Effective, StudioState } from "./axes"
import type { Studio } from "./use-studio"

export type { Studio }

export interface Chapter {
  id: string
  label: string
  /** Axis modules (or single keys) whose rows sit here, when not the
   *  chapter's own id. */
  owners?: string[]
  /** Former names search still answers to. */
  aliases?: string[]
  /** The rows on the page: the chapter's two or three decisions that matter. */
  Primary?: React.ComponentType<{ studio: Studio }>
  /** The rest of the chapter. */
  Body: React.ComponentType<{ studio: Studio }>
  /** A glyph-sized specimen of the chapter's state, beside its title. */
  Preview?: React.ComponentType<{ state: Effective }>
  /** Pages the body's rows open in place of the panel page. */
  pages?: ChapterPage[]
}

export interface ChapterPage {
  /** Also its deep link: `/studio#<id>[/<member>]`. */
  id: string
  label: string
  /** Axis modules (or single keys) whose rows sit here. */
  owners?: string[]
  /** Component names search answers to. */
  aliases?: string[]
  Preview?: React.ComponentType<{ state: Effective }>
  Body: React.ComponentType<{ studio: Studio }>
}

/* The foundations, flat, then every component family behind one row. */
export const CHAPTERS: Chapter[] = [
  {
    id: "color",
    label: "Color",
    owners: ["color", "surfaces", ...PRIMARY_LEAVES],
    Primary: ColorPrimary,
    Body: ColorSection,
    Preview: ColorPreview,
  },
  {
    id: "typography",
    label: "Typography",
    owners: ["type"],
    aliases: ["Menu labels"],
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
    aliases: ["Spacing"],
    Body: SpaceSection,
    Preview: SpacePreview,
  },
  {
    id: "states",
    label: "States",
    owners: ["states", "selection"],
    aliases: ["Interactivity"],
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
    id: "components",
    label: "Components",
    Body: ComponentsSection,
    pages: COMPONENT_PAGES,
  },
]

const lists = (place: { id: string; owners?: string[] }, name: string) =>
  (place.owners ?? [place.id]).includes(name)

/** Where a key's row sits: a place that lists the key itself wins over the
 *  one that lists its module. */
export function placeOf(
  key: string,
): { chapter: Chapter; page?: ChapterPage } | undefined {
  for (const name of [key, KEY_OWNER[key]]) {
    if (!name) continue
    for (const chapter of CHAPTERS) {
      if (lists(chapter, name)) return { chapter }
      const page = chapter.pages?.find((p) => lists(p, name))
      if (page) return { chapter, page }
    }
  }
}
