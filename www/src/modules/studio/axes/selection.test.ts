import { describe, expect, it } from "vitest"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("selection axes", () => {
  it("emits no tokens for the defaults", () => {
    const { tokens } = designSystemOf(DEFAULT_STATE)
    expect(
      Object.keys(tokens).filter((k) => /selection|select-ui/.test(k)),
    ).toEqual([])
  })

  it("maps selectable UI text and the OS highlight to tokens", () => {
    const { tokens } = designSystemOf(
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

  it("re-points the highlight at the neutral ramp, a step up in dark", () => {
    const neutral = designSystemOf(
      parseState({ selectionHighlight: "neutral" }),
    )
    const accent = designSystemOf(DEFAULT_STATE)
    expect(neutral.color).not.toEqual(accent.color)
  })

  it("paints a custom highlight with the ink that reads on it", () => {
    const tokens = (selectionCustomColor: string) =>
      designSystemOf(
        parseState({ selectionHighlight: "custom", selectionCustomColor }),
      ).tokens
    expect(tokens("#fde68a")).toMatchObject({
      "--color-text-selection": "#fde68a",
      "--color-fg-on-text-selection":
        "light-dark(var(--neutral-950), var(--neutral-25))",
    })
    expect(tokens("#1e3a8a")).toMatchObject({
      "--color-text-selection": "#1e3a8a",
      "--color-fg-on-text-selection":
        "light-dark(var(--neutral-25), var(--neutral-950))",
    })
  })

  it("keeps the accent highlight until a custom color is picked", () => {
    const { tokens } = designSystemOf(
      parseState({ selectionHighlight: "custom" }),
    )
    expect(Object.keys(tokens).filter((k) => /selection/.test(k))).toEqual([])
  })
})
