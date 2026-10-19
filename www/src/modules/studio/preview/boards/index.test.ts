import { describe, expect, it } from "vitest"

import { KEY_BOARDS } from "@/modules/studio/focus"
import { BOARD_SLUG_PREFIX } from "@/modules/studio/preset/iframe-sync"
import { COMPONENTS } from "@/modules/studio/sections/components"

import { boardOf, BoardsIndex } from "."
import { BOARD_TITLES } from "./titles"

// Read, not imported: the boards pull the whole registry in.
const SOURCES = import.meta.glob<string>("./*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
})

describe("boards", () => {
  it("titles every component page, the state pages, Motion and Icons", () => {
    expect(Object.keys(BOARD_TITLES)).toEqual([
      ...COMPONENTS.map(({ id }) => id),
      "focus",
      "disabled",
      "cursor",
      "text-selection",
      "motion",
      "icons",
    ])
    expect(
      COMPONENTS.filter(
        ({ id, label }) =>
          (BOARD_TITLES as Record<string, string>)[id] !== label,
      ).map(({ id }) => id),
    ).toEqual([])
  })

  it("loads every titled board from its own file", () => {
    expect(Object.keys(BoardsIndex)).toEqual(Object.keys(BOARD_TITLES))
    expect(
      Object.keys(BoardsIndex).filter((id) => !SOURCES[`./${id}.tsx`]),
    ).toEqual([])
  })

  it("renders each board under its own id", () => {
    expect(
      Object.keys(BoardsIndex).filter(
        (id) => !SOURCES[`./${id}.tsx`]?.includes(`<Board id="${id}"`),
      ),
    ).toEqual([])
  })

  it("has a board for every key sent to one", () => {
    expect(
      Object.values(KEY_BOARDS).filter((board) => !BoardsIndex[board]),
    ).toEqual([])
  })

  it("maps preview slugs to boards", () => {
    expect(boardOf(`${BOARD_SLUG_PREFIX}button`)).toBe(BoardsIndex.button)
    expect(boardOf(`${BOARD_SLUG_PREFIX}segmented-control`)).toBe(
      BoardsIndex["segmented-control"],
    )
    expect(boardOf("button")).toBeUndefined()
    expect(boardOf(`${BOARD_SLUG_PREFIX}nope`)).toBeUndefined()
  })
})
