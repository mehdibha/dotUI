import { describe, expect, it } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

describe("selection and scrollbar axes", () => {
  it("emits no tokens for the defaults", () => {
    const { tokens } = resolveDesignSystem(DEFAULTS)
    expect(
      Object.keys(tokens).filter((k) =>
        /selection|select-ui|scrollbar/.test(k),
      ),
    ).toEqual([])
  })

  it("maps non-selectable UI text and the accent highlight to tokens", () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      selectionUiText: "none",
      selectionHighlight: "accent",
    })
    expect(tokens).toMatchObject({
      "--user-select-ui": "none",
      "--selection-bg": "var(--color-accent)",
      "--selection-fg": "var(--color-fg-on-accent)",
    })
  })

  it("maps the scrollbar styles to the width/color pair", () => {
    expect(
      resolveDesignSystem({ ...DEFAULTS, scrollbarStyle: "thin" }).tokens,
    ).toEqual({
      "--scrollbar-width": "thin",
      "--scrollbar-color": "var(--color-border) transparent",
    })
    expect(
      resolveDesignSystem({ ...DEFAULTS, scrollbarStyle: "overlay" }).tokens,
    ).toEqual({
      "--scrollbar-width": "thin",
      "--scrollbar-color": "transparent transparent",
      "--scrollbar-color-hover": "var(--color-border) transparent",
    })
  })
})
