import { describe, expect, test } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("feedback chapters (skeleton · spinner · progress)", () => {
  test("defaults resolve to the registry defaults and no tokens", () => {
    const ds = resolveDesignSystem(DEFAULT_STATE)
    expect(ds.componentParams.skeleton).toEqual({ animation: "shimmer" })
    expect(ds.componentParams.loader).toEqual({ style: "ring" })
    expect(ds.componentParams["progress-bar"]).toEqual({
      track: "thin",
      indeterminate: "slide",
      gap: "none",
    })
    expect(ds.tokens).toEqual({})
  })

  test("each axis lands on its param", () => {
    const ds = resolveDesignSystem(
      parseState({
        skeletonAnimation: "pulse",
        spinnerStyle: "blades",
        progressTrack: "thick",
        progressIndeterminate: "pulse",
        progressGap: true,
      }),
    )
    expect(ds.componentParams.skeleton).toEqual({ animation: "pulse" })
    expect(ds.componentParams.loader).toEqual({ style: "blades" })
    expect(ds.componentParams["progress-bar"]).toEqual({
      track: "thick",
      indeterminate: "pulse",
      gap: "cut",
    })
    expect(ds.tokens).toEqual({})
  })
})
