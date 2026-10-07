import { describe, expect, it } from "vitest"

import { BOARD_SLUG_PREFIX } from "@/modules/studio/preset/iframe-sync"

import { boardOf, BoardsIndex } from "."
import { COMPONENT_PAGES } from "../../sections/components"
import { CHAPTERS } from "../../state"

describe("boards", () => {
  it("has a board for every chapter and family page, under its label", () => {
    const places = [
      ...CHAPTERS.filter((chapter) => chapter.id !== "components"),
      ...COMPONENT_PAGES,
    ]
    expect(
      Object.fromEntries(
        Object.entries(BoardsIndex).map(([id, board]) => [id, board.title]),
      ),
    ).toEqual(
      Object.fromEntries(places.map((place) => [place.id, place.label])),
    )
  })

  it("maps preview slugs to boards", () => {
    expect(boardOf(`${BOARD_SLUG_PREFIX}buttons`)).toBe(BoardsIndex.buttons)
    expect(boardOf("buttons")).toBeUndefined()
    expect(boardOf(`${BOARD_SLUG_PREFIX}nope`)).toBeUndefined()
  })
})
