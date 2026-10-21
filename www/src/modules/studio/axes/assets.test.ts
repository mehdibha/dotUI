import { describe, expect, it } from "vitest"

import { getPreset, PRESETS } from "@/modules/presets"

import { designSystemOf } from "../resolve"

describe("assets", () => {
  it("dresses the preview only: a brand changes nothing else", () => {
    for (const { id, state } of PRESETS) {
      const { assets, ...rest } = designSystemOf(state)
      const { assets: none, ...bare } = designSystemOf({
        ...state,
        brandAssets: "none",
      })
      expect(none, id).toBeUndefined()
      expect(rest, id).toEqual(bare)
      if (state.brandAssets !== "none") expect(assets, id).toBeDefined()
    }
  })

  it("leaves Origin on the placeholder marks", () => {
    expect(designSystemOf(getPreset("origin")!.state).assets).toBeUndefined()
  })
})
