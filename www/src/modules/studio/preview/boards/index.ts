import type { ComponentType } from "react"

import { BOARD_SLUG_PREFIX } from "@/modules/studio/preset/iframe-sync"

import { BOARD_TITLES } from "./titles"
import type { BoardId } from "./titles"

type Load = () => Promise<{ default: ComponentType }>

// Iframe-only: one lazy chunk per board, `./<id>.tsx`.
const FILES = import.meta.glob<{ default: ComponentType }>([
  "./*.tsx",
  "!./board.tsx",
  "!./*-parts.tsx",
])

export const BoardsIndex = Object.fromEntries(
  Object.keys(BOARD_TITLES).flatMap((id) => {
    const load = FILES[`./${id}.tsx`]
    return load ? [[id, load]] : []
  }),
) as Partial<Record<BoardId, Load>>

/** The board a preview slug names, if any. */
export const boardOf = (slug: string) =>
  slug.startsWith(BOARD_SLUG_PREFIX)
    ? (BoardsIndex as Record<string, Load | undefined>)[
        slug.slice(BOARD_SLUG_PREFIX.length)
      ]
    : undefined
