import { afterEach, describe, expect, it } from "vitest"

import { focusOf, previewFocus, pushPopoverFocus, setPageFocus } from "./focus"

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

describe("focusOf", () => {
  it("reads a chapter row", () => {
    expect(
      focusOf(
        trigger({ "data-axis": "radiusPx" }, { "data-chapter": "shape" }),
        null,
      ),
    ).toEqual({
      board: "shape",
      member: undefined,
      axis: "radiusPx",
      popover: true,
    })
  })

  it("prefers the page over the chapter, and names the member", () => {
    expect(
      focusOf(
        trigger(
          { "data-axis": "toggleSelected" },
          { "data-member": "toggle" },
          { "data-page": "buttons" },
          { "data-chapter": "components" },
        ),
        null,
      ),
    ).toEqual({
      board: "buttons",
      member: "toggle",
      axis: "toggleSelected",
      popover: true,
    })
  })

  it("takes the first held key when the row edits several", () => {
    expect(
      focusOf(
        trigger(
          { "data-holds": "rolePanel roleCard" },
          { "data-chapter": "shape" },
        ),
        null,
      )?.axis,
    ).toBe("rolePanel")
  })

  it("keeps the outer popover's board inside a popover", () => {
    const outer = {
      board: "dialogs",
      member: "modal",
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
  })
})

describe("focus store", () => {
  afterEach(() => setPageFocus(null))

  it("stacks popovers over the page", () => {
    setPageFocus("buttons")
    expect(previewFocus()).toEqual({ board: "buttons", popover: false })
    const close = pushPopoverFocus(
      trigger({ "data-axis": "buttonStyle" }, { "data-page": "buttons" }),
    )
    expect(previewFocus()).toMatchObject({
      board: "buttons",
      axis: "buttonStyle",
      popover: true,
    })
    const closeInner = pushPopoverFocus(trigger({ "data-axis": "buttonCase" }))
    expect(previewFocus()).toMatchObject({
      board: "buttons",
      axis: "buttonCase",
    })
    closeInner()
    close()
    expect(previewFocus()).toEqual({ board: "buttons", popover: false })
    setPageFocus(null)
    expect(previewFocus()).toBeNull()
  })

  it("clears on the main page when the popover closes", () => {
    const close = pushPopoverFocus(
      trigger({ "data-axis": "density" }, { "data-chapter": "space" }),
    )
    expect(previewFocus()?.board).toBe("space")
    close()
    expect(previewFocus()).toBeNull()
  })
})
