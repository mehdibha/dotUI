import { describe, expect, test } from "vitest"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("button groups axis", () => {
  test("defaults ship the registry default on both synced items", () => {
    const { componentParams, tokens } = designSystemOf(DEFAULT_STATE)
    expect(componentParams.group?.separator).toBe("shared-edge")
    expect(componentParams["toggle-button-group"]?.separator).toBe(
      "shared-edge",
    )
    expect(tokens).toEqual({})
  })

  test("separator writes group and toggle-button-group together", () => {
    for (const groupSeparator of ["divider", "shared-edge"]) {
      const { componentParams } = designSystemOf(
        parseState({ groupSeparator, buttonSecondary: "soft" }),
      )
      expect(componentParams.group?.separator).toBe(groupSeparator)
      expect(componentParams["toggle-button-group"]?.separator).toBe(
        groupSeparator,
      )
    }
  })
})
