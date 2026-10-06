import { describe, expect, test } from "vitest"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("button groups axis", () => {
  test("defaults ship the registry default on both synced items", () => {
    const { componentParams, tokens } = designSystemOf(DEFAULT_STATE)
    expect(componentParams.group?.separator).toBe("auto")
    expect(componentParams["toggle-button-group"]?.separator).toBe("auto")
    expect(tokens).toEqual({})
  })

  test("separator writes group and toggle-button-group together", () => {
    for (const groupSeparator of ["divider", "none"]) {
      const { componentParams } = designSystemOf(parseState({ groupSeparator }))
      expect(componentParams.group?.separator).toBe(groupSeparator)
      expect(componentParams["toggle-button-group"]?.separator).toBe(
        groupSeparator,
      )
    }
  })
})
