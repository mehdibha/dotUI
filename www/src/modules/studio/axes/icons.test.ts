import { describe, expect, it } from "vitest"

import { designSystemOf } from "../resolve"
import { LIBRARY_OPTIONS } from "./icons.meta"
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

  it("hides stroke and weight on the outlined sets; their own stroke ships no token", () => {
    for (const iconLibrary of ["material-symbols", "octicons"]) {
      const state = parseState({
        iconLibrary,
        iconStroke: 2.5,
        iconWeight: "bold",
      })
      const { explain } = effective(state)
      expect(explain.iconStroke?.lock?.kind, iconLibrary).toBe("hide")
      expect(explain.iconWeight?.lock?.kind, iconLibrary).toBe("hide")
      const { icons, tokens } = designSystemOf(state)
      expect(icons, iconLibrary).toBe(iconLibrary)
      expect(tokens, iconLibrary).toEqual({})
    }
  })
})
