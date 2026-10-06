import { describe, expect, test } from "vitest"

import { DEFAULT_STATE, parseState } from "."
import { designSystemOf } from "../resolve"

describe("disabled", () => {
  test("solid is the registry's own look: no tokens", () => {
    const { tokens } = designSystemOf(DEFAULT_STATE)
    expect(Object.keys(tokens).some((k) => k.includes("disabled"))).toBe(false)
  })

  test("fade unsets every recolor token and dims", () => {
    const { tokens } = designSystemOf(parseState({ disabledTreatment: "fade" }))
    expect(tokens["--disabled-opacity"]).toBe("0.5")
    for (const name of [
      "--disabled-bg",
      "--disabled-fg",
      "--disabled-border",
      "--disabled-selected-bg",
      "--disabled-selected-fg",
      "--disabled-unselected-bg",
      "--color-primary-disabled",
    ])
      expect(tokens[name]).toBe("initial")
  })

  test("alpha mixes ink at fixed alphas, no opacity", () => {
    const { tokens } = designSystemOf(
      parseState({ disabledTreatment: "alpha" }),
    )
    expect(tokens["--disabled-opacity"]).toBeUndefined()
    expect(tokens["--disabled-bg"]).toContain("12%")
    expect(tokens["--disabled-fg"]).toContain("38%")
    expect(tokens["--disabled-selected-fg"]).toBe("var(--color-bg)")
  })
})
