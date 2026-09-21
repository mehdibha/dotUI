import { describe, expect, test } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

const resolve = (overrides: Partial<typeof DEFAULTS>) =>
  resolveDesignSystem({ ...DEFAULTS, ...overrides })

describe("space axis", () => {
  test("defaults emit nothing and the default tier", () => {
    const system = resolve({})
    expect(system.tokens).toEqual({})
    expect(system.density).toBe("default")
  })

  test("density selects a registry tier; unknown values fall back", () => {
    expect(resolve({ density: "compact" }).density).toBe("compact")
    expect(resolve({ density: "cozy" }).density).toBe("default")
  })

  test("the unit lands on Tailwind's --spacing in rem", () => {
    expect(resolve({ spacingUnit: 5 }).tokens).toEqual({
      "--spacing": "0.3125rem",
    })
  })
})
