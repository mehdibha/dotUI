import { afterEach, describe, expect, it } from "vitest"

import {
  focusOf,
  pageBoard,
  previewFocus,
  pushPopoverFocus,
  setPageFocus,
} from "./focus"
import { COMPONENTS, isSingle, keysOf } from "./sections/components"
import { FOUNDATION_KEYS, FOUNDATION_PAGES } from "./sections/foundations"

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

const row = (axis: string, ...outer: Record<string, string>[]) =>
  focusOf(trigger({ "data-axis": axis }, ...outer), null)

describe("pages", () => {
  it("shows every component page on its own board", () => {
    expect(
      COMPONENTS.filter(({ id }) => pageBoard(id) !== id).map(({ id }) => id),
    ).toEqual([])
  })

  it("takes over only for the state pages and Motion among the foundation pages", () => {
    expect(FOUNDATION_PAGES.map(({ id }) => pageBoard(id) ?? null)).toEqual([
      null,
      "focus",
      "disabled",
      "cursor",
      "text-selection",
      null,
      "motion",
      null,
    ])
  })
})

describe("focusOf", () => {
  it("sends every component row to its component's page", () => {
    const wrong = COMPONENTS.flatMap((component) =>
      keysOf(component)
        .filter(
          (key) =>
            row(
              key,
              { "data-page": component.id },
              { "data-chapter": "components" },
            )?.board !== component.id,
        )
        .map((key) => `${component.id}.${key}`),
    )
    expect(wrong).toEqual([])
  })

  it("sends a one-key component row on the main page to its page", () => {
    const singles = COMPONENTS.filter(isSingle)
    expect(singles.length).toBeGreaterThan(0)
    for (const component of singles) {
      const [axis = ""] = keysOf(component)
      const page = { "data-page": component.id }
      const chapter = { "data-chapter": "components" }
      expect(row(axis, page, chapter)).toEqual({
        board: component.id,
        axis,
        popover: true,
      })
    }
  })

  it("leaves the user's preview for the foundation rows but Motion and Icons", () => {
    const takeovers = FOUNDATION_KEYS.filter(
      (key) => row(key, { "data-chapter": "foundations" }) !== null,
    )
    expect(takeovers.sort()).toEqual(["iconLibrary", "motion"])
    expect(row("motion", { "data-chapter": "foundations" })).toEqual({
      board: "motion",
      axis: "motion",
      popover: true,
    })
  })

  it("leaves the user's preview on the typography, shape and surfaces pages", () => {
    expect(row("headingFont", { "data-page": "typography" })).toBeNull()
    expect(row("roleCard", { "data-page": "shape" })).toBeNull()
    expect(row("surfaceEdge", { "data-page": "surfaces" })).toBeNull()
    expect(row("focusStyle", { "data-page": "focus" })).toEqual({
      board: "focus",
      axis: "focusStyle",
      popover: true,
    })
  })

  it("names every held key when the row edits several", () => {
    expect(
      focusOf(
        trigger(
          { "data-holds": "checkCorner checkEdge" },
          { "data-page": "checkbox" },
        ),
        null,
      ),
    ).toEqual({
      board: "checkbox",
      axis: "checkCorner",
      holds: ["checkCorner", "checkEdge"],
      popover: true,
    })
  })

  it("keeps the outer popover's board inside a popover", () => {
    const outer = {
      board: "dialog" as const,
      axis: "dialogBackdrop",
      popover: true,
    }
    expect(focusOf(trigger({ "data-axis": "dialogFrost" }), outer)).toEqual({
      ...outer,
      axis: "dialogFrost",
    })
    expect(focusOf(trigger(), outer)).toEqual(outer)
    expect(focusOf(trigger({ "data-axis": "x" }), null)).toBeNull()
  })

  it("ignores triggers outside the panel's pages and chapters", () => {
    expect(focusOf(trigger(), { board: "button", popover: false })).toBeNull()
    expect(row("x", { "data-page": "nope" })).toBeNull()
  })
})

describe("focus store", () => {
  afterEach(() => setPageFocus(null))

  it("stacks popovers over the page", () => {
    setPageFocus("checkbox")
    expect(previewFocus()).toEqual({ board: "checkbox", popover: false })
    const close = pushPopoverFocus(
      trigger({ "data-axis": "checkboxMotion" }, { "data-page": "checkbox" }),
    )
    expect(previewFocus()).toEqual({
      board: "checkbox",
      axis: "checkboxMotion",
      popover: true,
    })
    const closeInner = pushPopoverFocus(trigger({ "data-axis": "checkEdge" }))
    expect(previewFocus()).toMatchObject({
      board: "checkbox",
      axis: "checkEdge",
    })
    closeInner()
    close()
    expect(previewFocus()).toEqual({ board: "checkbox", popover: false })
    setPageFocus(null)
    expect(previewFocus()).toBeNull()
  })

  it("leaves the preview alone on unknown and foundation pages", () => {
    setPageFocus("nope")
    expect(previewFocus()).toBeNull()
    setPageFocus("color")
    expect(previewFocus()).toBeNull()
  })

  it("clears on the main page when the Motion popover closes", () => {
    const close = pushPopoverFocus(
      trigger({ "data-axis": "motion" }, { "data-chapter": "foundations" }),
    )
    expect(previewFocus()?.board).toBe("motion")
    close()
    expect(previewFocus()).toBeNull()
  })
})
