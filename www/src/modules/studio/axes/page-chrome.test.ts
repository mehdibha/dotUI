import { describe, expect, it } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("selection and scrollbar axes", () => {
  it("emits no tokens for the defaults", () => {
    const { tokens } = resolveDesignSystem(DEFAULT_STATE)
    expect(
      Object.keys(tokens).filter((k) =>
        /selection|select-ui|scrollbar/.test(k),
      ),
    ).toEqual([])
  })

  it("maps selectable UI text and the OS highlight to tokens", () => {
    const { tokens } = resolveDesignSystem(
      parseState({
        selectionUiText: "selectable",
        selectionHighlight: "browser",
      }),
    )
    expect(tokens).toEqual({
      "--user-select-ui": "auto",
      "--color-text-selection": "Highlight",
      "--color-fg-on-text-selection": "HighlightText",
    })
  })

  it("maps the scrollbar styles to the width/color pair", () => {
    expect(
      resolveDesignSystem(parseState({ scrollbarStyle: "thin" })).tokens,
    ).toEqual({
      "--scrollbar-width": "thin",
      "--scrollbar-color": "var(--color-border) transparent",
    })
    expect(
      resolveDesignSystem(parseState({ scrollbarStyle: "overlay" })).tokens,
    ).toEqual({
      "--scrollbar-width": "thin",
      "--scrollbar-color": "transparent transparent",
      "--scrollbar-color-hover": "var(--color-border) transparent",
    })
  })
})
