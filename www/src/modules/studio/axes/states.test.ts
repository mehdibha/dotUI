import { describe, expect, test } from "vitest"

import { DEFAULT_STATE, parseState } from "."
import { resolveDesignSystem } from "../resolve"

describe("disabled", () => {
  test("solid is the registry's own look: no tokens", () => {
    const { tokens } = resolveDesignSystem(DEFAULT_STATE)
    expect(Object.keys(tokens).some((k) => k.includes("disabled"))).toBe(false)
  })

  test("fade unsets every recolor token and dims", () => {
    const { tokens } = resolveDesignSystem(
      parseState({ disabledTreatment: "fade" }),
    )
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
    const { tokens } = resolveDesignSystem(
      parseState({ disabledTreatment: "alpha" }),
    )
    expect(tokens["--disabled-opacity"]).toBeUndefined()
    expect(tokens["--disabled-bg"]).toContain("12%")
    expect(tokens["--disabled-fg"]).toContain("38%")
    expect(tokens["--disabled-selected-fg"]).toBe("var(--color-bg)")
  })
})

describe("invalid", () => {
  test("drives the field error param; the bar carries its vars", () => {
    const plain = resolveDesignSystem(DEFAULT_STATE)
    expect(plain.componentParams.field?.error).toBe("border")
    expect(plain.tokens["--studio-field-error-bar"]).toBeUndefined()

    const bar = resolveDesignSystem(parseState({ inputError: "bar" }))
    expect(bar.componentParams.field?.error).toBe("bar")
    expect(bar.tokens["--studio-field-error-bar"]).toBe("3px")
  })
})
