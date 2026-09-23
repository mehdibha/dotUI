import { describe, expect, it } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

describe("tables axis", () => {
  it("defaults resolve to the registry defaults and no tokens", () => {
    const system = resolveDesignSystem(DEFAULTS)
    expect(system.componentParams.table).toEqual({
      separation: "lines",
      header: "plain",
    })
    expect(system.tokens).toEqual({})
  })

  it("maps separation and header onto table params", () => {
    const system = resolveDesignSystem({
      ...DEFAULTS,
      tableSeparation: "striped",
      tableHeader: "filled",
    })
    expect(system.componentParams.table).toEqual({
      separation: "striped",
      header: "filled",
    })
    expect(system.tokens).toEqual({})
  })
})
