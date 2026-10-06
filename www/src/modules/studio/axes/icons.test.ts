import { describe, expect, it } from "vitest"

import { designSystemOf } from "../resolve"
import { LIBRARY_OPTIONS } from "./icons"
import { effective, parseState } from "./index"

describe("icons axis", () => {
  it("Auto stroke resolves on every library without a rule firing", () => {
    for (const { value: iconLibrary } of LIBRARY_OPTIONS) {
      const { explain } = effective(parseState({ iconLibrary }))
      expect(explain.iconStroke?.via, `${iconLibrary}`).toBe("auto")
      expect(explain.iconStroke?.rule, `${iconLibrary}`).toBeUndefined()
      expect(
        designSystemOf(parseState({ iconLibrary })).tokens,
        `${iconLibrary}`,
      ).toEqual({})
    }
  })
})
