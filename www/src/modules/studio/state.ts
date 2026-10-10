"use client"

/* The panel's chapters, in page order. */

import { DEFAULTS, KEY_OWNER } from "./axes"
import type { Effective } from "./axes"
import { ROWS as buttonsRows } from "./sections/buttons"
import { ROWS as chartsRows } from "./sections/charts"
import { ROWS as colorRows } from "./sections/color"
import { COMPONENT_CHAPTERS, COMPONENTS, isSingle } from "./sections/components"
import { ROWS as dataDisplayRows } from "./sections/data-display"
import { ROWS as datesRows } from "./sections/dates"
import { ROWS as dialogsRows } from "./sections/dialogs"
import { ROWS as feedbackRows } from "./sections/feedback"
import {
  FOUNDATION_KEYS,
  FOUNDATION_PAGES,
  FOUNDATION_ROWS,
  FoundationsSection,
} from "./sections/foundations"
import { ROWS as iconsRows } from "./sections/icons"
import { ROWS as inputsRows } from "./sections/inputs"
import { ROWS as menusRows } from "./sections/menus"
import { ROWS as motionRows } from "./sections/motion"
import { ROWS as navigationRows } from "./sections/navigation"
import { ROWS as primaryRows } from "./sections/primary"
import { ROWS as selectionRows } from "./sections/selection"
import { ROWS as shapeRows } from "./sections/shape"
import { ROWS as spaceRows } from "./sections/space"
import { ROWS as statesRows } from "./sections/states"
import { ROWS as styleRows } from "./sections/style"
import { ROWS as surfacesRows } from "./sections/surfaces"
import { ROWS as typeRows } from "./sections/type"

export type { Effective, StudioState } from "./axes"
import type { RowMap } from "./family-page"
import type { Studio } from "./use-studio"

export type { Studio }

/** Each section's rows. */
export const SECTION_ROWS: Record<string, RowMap> = {
  buttons: buttonsRows,
  charts: chartsRows,
  color: colorRows,
  dataDisplay: dataDisplayRows,
  dates: datesRows,
  dialogs: dialogsRows,
  feedback: feedbackRows,
  icons: iconsRows,
  inputs: inputsRows,
  menus: menusRows,
  motion: motionRows,
  navigation: navigationRows,
  primary: primaryRows,
  selection: selectionRows,
  shape: shapeRows,
  space: spaceRows,
  states: statesRows,
  style: styleRows,
  surfaces: surfacesRows,
  type: typeRows,
}

/** Every key's row, for `<Row>` (a key in two sections fails a test). */
export const ALL_ROWS: RowMap = Object.assign(
  {},
  ...Object.values(SECTION_ROWS),
)

/** A row, for search: its name, the key it edits, other names it answers to. */
export interface SearchRow {
  name: string
  key?: string
  aliases?: string[]
}

export interface Chapter {
  id: string
  label: string
  /** Keys (or axis modules) whose rows sit on the chapter itself. */
  owners?: string[]
  /** Other names search answers to. */
  aliases?: string[]
  /** Its rows, for search. */
  rows?: SearchRow[]
  Body: React.ComponentType<{ studio: Studio }>
  /** Pages the body's rows open in place of the panel page. */
  pages?: ChapterPage[]
}

export interface ChapterPage {
  /** Also its deep link: `/studio#<id>`. */
  id: string
  label: string
  /** Keys (or axis modules) whose rows sit here. */
  owners?: string[]
  /** Other names search answers to. */
  aliases?: string[]
  /** Its rows, for search. */
  rows?: SearchRow[]
  Preview?: React.ComponentType<{ state: Effective }>
  Body: React.ComponentType<{ studio: Studio }>
}

export const CHAPTERS: Chapter[] = [
  {
    id: "foundations",
    label: "Foundations",
    owners: FOUNDATION_KEYS,
    rows: FOUNDATION_ROWS,
    Body: FoundationsSection,
    pages: FOUNDATION_PAGES,
  },
  ...COMPONENT_CHAPTERS,
]

const lists = (place: { owners?: string[] }, name: string) =>
  place.owners?.includes(name) ?? false

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

/* Hashes from the family pages, to the page that holds most of the old one. */
const MOVED: Record<string, string> = {
  buttons: "button",
  "buttons/segmented": "segmented-control",
  inputs: "field",
  "inputs/otp": "otp-field",
  selection: "checkbox",
  menus: "menu",
  dialogs: "dialog",
  "dialogs/drawer": "sheet",
  nav: "tabs",
  dates: "calendar",
  display: "table",
  feedback: "toast",
  "feedback/loading": "progress",
  charts: "chart",
  states: "interaction",
}

/** What `/studio#<hash>` opens: a page, else the row a key or a one-row
 *  component sits on. Old `#<family>[/<member>]` hashes land nearby. */
export function linkTarget(
  hash: string,
): { page: string } | { key: string } | undefined {
  const [family = "", member = ""] = hash.split("/")
  const pages = CHAPTERS.flatMap((chapter) => chapter.pages ?? [])
  for (const id of [MOVED[hash], member, MOVED[family], family]) {
    if (!id) continue
    if (pages.some((page) => page.id === id)) return { page: id }
    const single = COMPONENTS.find((c) => c.id === id && isSingle(c))
    const key = single?.rows[0]?.[0] ?? (Object.hasOwn(DEFAULTS, id) && id)
    if (key) return { key }
  }
}
