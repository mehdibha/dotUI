import { describe, expect, test } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

describe("button groups axis", () => {
  test("defaults ship the registry default on both synced items", () => {
    const { componentParams, tokens } = resolveDesignSystem(DEFAULTS)
    expect(componentParams.group?.separator).toBe("auto")
    expect(componentParams["toggle-button-group"]?.separator).toBe("auto")
    expect(tokens).toEqual({})
  })

  test("separator writes group and toggle-button-group together", () => {
    for (const groupSeparator of ["divider", "none"]) {
      const { componentParams } = resolveDesignSystem({
        ...DEFAULTS,
        groupSeparator,
      })
      expect(componentParams.group?.separator).toBe(groupSeparator)
      expect(componentParams["toggle-button-group"]?.separator).toBe(
        groupSeparator,
      )
    }
  })

  test("unknown values fall back to auto", () => {
    const { componentParams } = resolveDesignSystem({
      ...DEFAULTS,
      groupSeparator: "dotted",
    })
    expect(componentParams.group?.separator).toBe("auto")
  })
})
