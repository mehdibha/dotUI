import { describe, expect, test } from "vitest"

import { CATALOG, DEFAULTS } from "@/modules/studio/axes"
import { decodePreset } from "@/modules/studio/preset/codec"

import {
  exportDesign,
  getDesign,
  listAxes,
  listPresets,
  previewUrls,
  setAxes,
  ToolError,
} from "./tools"

const ORIGIN = "https://dotui.org"

describe("list_axes", () => {
  test("the overview names every chapter and axis", () => {
    const { chapters } = listAxes()
    const keys = chapters.flatMap((c) => c.axes.map((a) => a.key))
    expect(new Set(keys)).toEqual(new Set(Object.keys(DEFAULTS)))
  })

  test("a chapter comes back in full with defaults", () => {
    const [shape] = listAxes(["shape"]).chapters
    const radius = shape?.axes.find((a) => a.key === "radiusPx")
    expect(radius).toMatchObject({ default: 10, value: { type: "number" } })
    expect(shape).toHaveProperty("recipes")
  })

  test("unknown chapters are an error", () => {
    expect(() => listAxes(["nope"])).toThrow(ToolError)
  })
})

describe("set_axes", () => {
  test("applies values and round-trips through the preset", () => {
    const { preset, changed } = setAxes(ORIGIN, {
      set: { radiusPx: 6, roleControl: "sm" },
    })
    expect(decodePreset(preset).state).toMatchObject({
      radiusPx: 6,
      roleControl: "sm",
    })
    expect(changed.shape).toEqual({ radiusPx: 6, roleControl: "sm" })
  })

  test("reports what moved in the resolved system", () => {
    const { effects } = setAxes(ORIGIN, { set: { radiusPx: 12 } })
    expect(effects.tokens["--radius"]).toEqual({
      from: undefined,
      to: "0.75rem",
    })
  })

  test("is atomic and lists every problem", () => {
    const run = () =>
      setAxes(ORIGIN, { set: { radiusPx: 999, roleControl: "huge", nope: 1 } })
    expect(run).toThrow(/radiusPx/)
    expect(run).toThrow(/roleControl/)
    expect(run).toThrow(/nope: unknown axis/)
  })

  test("suggests the axis a near-miss key meant", () => {
    expect(() => setAxes(ORIGIN, { set: { radius: 8 } })).toThrow(/radiusPx/)
  })

  test("resets axes and whole chapters", () => {
    const { preset } = setAxes(ORIGIN, {
      set: { radiusPx: 6, roleControl: "sm" },
    })
    const one = setAxes(ORIGIN, { preset, reset: ["radiusPx"] })
    expect(one.changed.shape).toEqual({ roleControl: "sm" })
    const all = setAxes(ORIGIN, { preset, reset: ["shape"] })
    expect(all.preset).toBe("")
  })

  test("code options ride in the preset", () => {
    const { preset } = setAxes(ORIGIN, { codeOptions: { classArrays: true } })
    expect(getDesign(ORIGIN, preset).codeOptions.classArrays).toBe(true)
  })

  test("every chapter's recipes apply cleanly", () => {
    for (const chapter of CATALOG)
      for (const recipe of chapter.recipes ?? [])
        expect(() => setAxes(ORIGIN, { set: recipe.set })).not.toThrow()
  })
})

describe("presets and links", () => {
  test("presets decode to their own state", () => {
    const [origin] = listPresets().presets
    expect(decodePreset(origin?.preset ?? "").state.brand).toBe("#0072f5")
  })

  test("links carry the preset", () => {
    const { preset } = setAxes(ORIGIN, { set: { radiusPx: 6 } })
    expect(previewUrls(ORIGIN, preset).studio).toBe(
      `${ORIGIN}/studio?preset=${preset}`,
    )
    expect(exportDesign(ORIGIN, preset).shadcn.init.npm).toContain(
      `${ORIGIN}/r/init?preset=${preset}`,
    )
  })
})
