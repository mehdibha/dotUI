import { describe, expect, test } from "vitest"

import { DEFAULTS } from "."
import { resolveDesignSystem } from "../resolve"

describe("disabled", () => {
  test("solid is the registry's own look: no tokens", () => {
    const { tokens } = resolveDesignSystem(DEFAULTS)
    expect(Object.keys(tokens).some((k) => k.includes("disabled"))).toBe(false)
  })

  test("fade dims and keeps every colored fill's own token", () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      disabledTreatment: "fade",
    })
    expect(tokens["--disabled-opacity"]).toBe("0.5")
    expect(tokens["--color-primary-disabled"]).toBe("var(--color-primary)")
    expect(tokens["--color-selection-disabled"]).toBe("var(--color-selection)")
    expect(tokens["--color-disabled"]).toBeUndefined()
  })

  test("alpha mixes ink at fixed alphas, no opacity", () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      disabledTreatment: "alpha",
    })
    expect(tokens["--disabled-opacity"]).toBeUndefined()
    expect(tokens["--color-disabled"]).toContain("12%")
    expect(tokens["--color-fg-disabled"]).toContain("38%")
  })
})

describe("invalid", () => {
  test("drives the field error param", () => {
    expect(resolveDesignSystem(DEFAULTS).componentParams.field?.error).toBe(
      "border",
    )
    expect(
      resolveDesignSystem({ ...DEFAULTS, inputError: "bar" }).componentParams
        .field?.error,
    ).toBe("bar")
    expect(
      resolveDesignSystem({ ...DEFAULTS, inputError: "nope" }).componentParams
        .field?.error,
    ).toBe("border")
  })
})
