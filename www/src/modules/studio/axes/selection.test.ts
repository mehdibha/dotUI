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
})
