import { afterEach, describe, expect, it } from "vitest"

import {
  CHAPTER_PLACES,
  focusOf,
  KEY_BOARDS,
  PAGE_PLACES,
  previewFocus,
  pushPopoverFocus,
  setPageFocus,
} from "./focus"
import { COMPONENTS, isSingle } from "./sections/components"
import { FOUNDATION_PAGES } from "./sections/foundations"

/** A trigger whose ancestors carry `attributes`, innermost first. */
function trigger(...ancestors: Record<string, string>[]) {
  return {
    closest(selector: string) {
      const names = [...selector.matchAll(/\[([\w-]+)\]/g)].map(
        (m) => m[1] ?? "",
      )
      const found = ancestors.find((a) => names.some((name) => name in a))
      return found
        ? { getAttribute: (name: string) => found[name] ?? null }
        : null
    },
  }
}

describe("places", () => {
  it("puts every component page on its own section", () => {
    expect(
      COMPONENTS.filter(({ id }) => PAGE_PLACES[id]?.member !== id).map(
        ({ id }) => id,
      ),
    ).toEqual([])
  })

  it("shows a one-key component's row on its board from the main page", () => {
    expect(
      COMPONENTS.filter(isSingle)
        .filter(
          ({ id, chapter }) =>
            CHAPTER_PLACES[chapter]?.board !== PAGE_PLACES[id]?.board,
        )
        .map(({ id }) => id),
    ).toEqual([])
  })

  it("puts every foundation page and row on its board", () => {
    expect(FOUNDATION_PAGES.map(({ id }) => PAGE_PLACES[id]?.board)).toEqual([
      "color",
      "typography",
      "shape",
      "states",
    ])
    const rows = [
      "style",
      "brand",
      "neutralTint",
      "neutralHue",
      "bodyFont",
      "radiusPx",
      "density",
      "iconLibrary",
      "motion",
    ]
    expect(rows.filter((key) => !KEY_BOARDS[key])).toEqual([])
    expect(Object.keys(PAGE_PLACES)).toHaveLength(
      COMPONENTS.length + FOUNDATION_PAGES.length,
    )
  })
})

describe("focusOf", () => {
  it("reads a foundation row by its key", () => {
    expect(
      focusOf(
        trigger({ "data-axis": "radiusPx" }, { "data-chapter": "foundations" }),
        null,
      ),
    ).toEqual({ board: "shape", axis: "radiusPx", popover: true })
    expect(
      focusOf(
        trigger({ "data-axis": "style" }, { "data-chapter": "foundations" }),
        null,
      ),
    ).toMatchObject({ board: "buttons", axis: "style" })
  })

  it("reads a one-key component row by its chapter", () => {
    expect(
      focusOf(
        trigger({ "data-axis": "otpStyle" }, { "data-chapter": "forms" }),
        null,
      ),
    ).toEqual({ board: "inputs", axis: "otpStyle", popover: true })
  })

  it("prefers the page over the chapter, at its member", () => {
    expect(
      focusOf(
        trigger(
          { "data-axis": "toggleSelected" },
          { "data-page": "button" },
          { "data-chapter": "actions" },
        ),
        null,
      ),
    ).toEqual({
      board: "buttons",
      member: "button",
      axis: "toggleSelected",
      popover: true,
    })
  })

  it("sends a key shown elsewhere to its board", () => {
    expect(
      focusOf(
        trigger({ "data-axis": "mobilePickers" }, { "data-page": "select" }),
        null,
      ),
    ).toEqual({ board: "menus", axis: "mobilePickers", popover: true })
  })

  it("names every held key when the row edits several", () => {
    expect(
      focusOf(
        trigger(
          { "data-holds": "rolePanel roleCard" },
          { "data-page": "shape" },
        ),
        null,
      ),
    ).toMatchObject({ axis: "rolePanel", holds: ["rolePanel", "roleCard"] })
  })

  it("keeps the outer popover's place inside a popover", () => {
    const outer = {
      board: "dialogs" as const,
      member: "dialog",
      axis: "dialogBackdrop",
      popover: true,
    }
    expect(focusOf(trigger({ "data-axis": "dialogFrost" }), outer)).toEqual({
      ...outer,
      axis: "dialogFrost",
    })
    expect(focusOf(trigger(), outer)).toEqual(outer)
  })

  it("ignores triggers outside the panel's pages and chapters", () => {
    expect(focusOf(trigger({ "data-axis": "x" }), null)).toBeNull()
    expect(focusOf(trigger(), { board: "buttons", popover: false })).toBeNull()
    expect(
      focusOf(trigger({ "data-axis": "x" }, { "data-page": "nope" }), null),
    ).toBeNull()
  })
})

describe("focus store", () => {
  afterEach(() => setPageFocus(null))

  it("stacks popovers over the page", () => {
    setPageFocus("checkbox")
    expect(previewFocus()).toEqual({
      board: "selection",
      member: "checkbox",
      popover: false,
    })
    const close = pushPopoverFocus(
      trigger({ "data-axis": "checkboxMotion" }, { "data-page": "checkbox" }),
    )
    expect(previewFocus()).toMatchObject({
      board: "selection",
      member: "checkbox",
      axis: "checkboxMotion",
      popover: true,
    })
    const closeInner = pushPopoverFocus(trigger({ "data-axis": "checkEdge" }))
    expect(previewFocus()).toMatchObject({
      board: "selection",
      axis: "checkEdge",
    })
    closeInner()
    close()
    expect(previewFocus()).toEqual({
      board: "selection",
      member: "checkbox",
      popover: false,
    })
    setPageFocus(null)
    expect(previewFocus()).toBeNull()
  })

  it("leaves the preview alone on an unknown page", () => {
    setPageFocus("nope")
    expect(previewFocus()).toBeNull()
  })

  it("clears on the main page when the popover closes", () => {
    const close = pushPopoverFocus(
      trigger({ "data-axis": "density" }, { "data-chapter": "foundations" }),
    )
    expect(previewFocus()?.board).toBe("space")
    close()
    expect(previewFocus()).toBeNull()
  })
})
