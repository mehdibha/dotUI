import type { ComponentType } from "react"

import { BOARD_SLUG_PREFIX } from "@/modules/studio/preset/iframe-sync"

import { BOARD_TITLES } from "./titles"
import type { BoardId } from "./titles"

type Load = () => Promise<{ default: ComponentType }>

// Iframe-only: each loader carries its chunk's whole dependency map.
const LOADERS: Record<BoardId, Load> = {
  color: () => import("./color"),
  typography: () => import("./typography"),
  icons: () => import("./icons"),
  shape: () => import("./shape"),
  space: () => import("./space"),
  states: () => import("./states"),
  motion: () => import("./motion"),
  buttons: () => import("./buttons"),
  inputs: () => import("./inputs"),
  selection: () => import("./selection"),
  menus: () => import("./menus"),
  dialogs: () => import("./dialogs"),
  nav: () => import("./nav"),
  dates: () => import("./dates"),
  display: () => import("./display"),
  feedback: () => import("./feedback"),
  charts: () => import("./charts"),
}

export const BoardsIndex: Record<string, { title: string; load: Load }> =
  Object.fromEntries(
    Object.entries(LOADERS).map(([id, load]) => [
      id,
      { title: BOARD_TITLES[id as BoardId], load },
    ]),
  )

/** The board a preview slug names, if any. */
export const boardOf = (slug: string) =>
  slug.startsWith(BOARD_SLUG_PREFIX)
    ? BoardsIndex[slug.slice(BOARD_SLUG_PREFIX.length)]
    : undefined
