import { describe, expect, test } from "vitest"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

describe("feedback chapters (skeleton · spinner · progress)", () => {
  test("defaults resolve to the registry defaults and no tokens", () => {
    const ds = resolveDesignSystem(DEFAULTS)
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
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      skeletonAnimation: "pulse",
      spinnerStyle: "blades",
      progressTrack: "thick",
      progressIndeterminate: "pulse",
      progressGap: true,
    })
    expect(ds.componentParams.skeleton).toEqual({ animation: "pulse" })
    expect(ds.componentParams.loader).toEqual({ style: "blades" })
    expect(ds.componentParams["progress-bar"]).toEqual({
      track: "thick",
      indeterminate: "pulse",
      gap: "cut",
    })
    expect(ds.tokens).toEqual({})
  })

  test("progress ends go square with square controls", () => {
    expect(
      resolveDesignSystem({ ...DEFAULTS, roleControl: "none" }).tokens[
        "--studio-progress-radius"
      ],
    ).toBe("0")
    expect(
      resolveDesignSystem({ ...DEFAULTS, roleControl: "sm" }).tokens[
        "--studio-progress-radius"
      ],
    ).toBeUndefined()
  })

  test("unknown values fall back to the defaults", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      skeletonAnimation: "wave",
      spinnerStyle: "bars",
      progressTrack: "huge",
    })
    expect(ds.componentParams.skeleton).toEqual({ animation: "shimmer" })
    expect(ds.componentParams.loader).toEqual({ style: "ring" })
    expect(ds.componentParams["progress-bar"]?.track).toBe("thin")
  })
})
