import { describe, expect, it } from "vitest"

import { KEY_BOARDS, PAGE_PLACES } from "@/modules/studio/focus"
import { BOARD_SLUG_PREFIX } from "@/modules/studio/preset/iframe-sync"

import { boardOf, BoardsIndex } from "."
import { BOARD_TITLES } from "./titles"

// Read, not imported: the boards pull the whole registry in.
const SOURCES = import.meta.glob<string>("./*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
})

const membersOf = (board: string) =>
  [...(SOURCES[`./${board}.tsx`] ?? "").matchAll(/member="([\w-]+)"/g)].map(
    (match) => match[1],
  )

describe("boards", () => {
  it("loads every titled board", () => {
    expect(Object.keys(BoardsIndex)).toEqual(Object.keys(BOARD_TITLES))
    expect(
      Object.keys(BoardsIndex).filter((id) => !SOURCES[`./${id}.tsx`]),
    ).toEqual([])
  })

  it("has every page's board and member section", () => {
    const missing = Object.entries(PAGE_PLACES).filter(
      ([, { board, member }]) =>
        !BoardsIndex[board] || (member && !membersOf(board).includes(member)),
    )
    expect(missing).toEqual([])
  })

  it("shows every key sent to a board of its own", () => {
    const missing = Object.entries(KEY_BOARDS).filter(
      ([key, board]) => !SOURCES[`./${board}.tsx`]?.includes(`"${key}"`),
    )
    expect(missing).toEqual([])
  })

  it("maps preview slugs to boards", () => {
    expect(boardOf(`${BOARD_SLUG_PREFIX}buttons`)).toBe(BoardsIndex.buttons)
    expect(boardOf("buttons")).toBeUndefined()
    expect(boardOf(`${BOARD_SLUG_PREFIX}nope`)).toBeUndefined()
  })
})
