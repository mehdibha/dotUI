import { describe, expect, test } from "vitest"

import { DEFAULTS } from "."
import { resolveDesignSystem } from "../resolve"

describe("disabled", () => {
  test("solid is the registry's own look: no tokens", () => {
    const { tokens } = resolveDesignSystem(DEFAULTS)
    expect(Object.keys(tokens).some((k) => k.includes("disabled"))).toBe(false)
  })

  test("fade unsets every recolor token and dims", () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      disabledTreatment: "fade",
    })
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
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      disabledTreatment: "alpha",
    })
    expect(tokens["--disabled-opacity"]).toBeUndefined()
    expect(tokens["--disabled-bg"]).toContain("12%")
    expect(tokens["--disabled-fg"]).toContain("38%")
    expect(tokens["--disabled-selected-fg"]).toBe("var(--color-bg)")
  })
})

describe("invalid", () => {
  test("drives the field error param; the bar carries its vars", () => {
    const plain = resolveDesignSystem(DEFAULTS)
    expect(plain.componentParams.field?.error).toBe("border")
    expect(plain.tokens["--field-error-bar"]).toBeUndefined()

    const bar = resolveDesignSystem({ ...DEFAULTS, inputError: "bar" })
    expect(bar.componentParams.field?.error).toBe("bar")
    expect(bar.tokens["--field-error-bar"]).toBe("3px")

    expect(
      resolveDesignSystem({ ...DEFAULTS, inputError: "nope" }).componentParams
        .field?.error,
    ).toBe("border")
  })
})
