import { describe, expect, it } from "vitest"

import {
  DEFAULT_STATE,
  DEFAULTS,
  effective,
  validate,
} from "@/modules/studio/axes"
import { COLUMNS } from "@/modules/studio/axes/style"
import { designSystemOf } from "@/modules/studio/resolve"

import pinned from "./__fixtures__/baseline-889.json"
import { ORIGIN, PRESETS } from "./index"

describe("built-in presets", () => {
  it("validate", () => {
    for (const preset of PRESETS)
      expect(validate(preset.state), preset.id).toEqual({
        ok: true,
        state: preset.state,
      })
  })

  it("have unique, slug-shaped ids", () => {
    const ids = PRESETS.map((preset) => preset.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/)
  })

  it("start from Origin, the builder defaults", () => {
    expect(ORIGIN.diff).toEqual({})
    expect(ORIGIN.state).toEqual(DEFAULT_STATE)
  })

  it("hold only what differs from Origin and their Style", () => {
    for (const preset of PRESETS)
      for (const [key, value] of Object.entries(preset.diff)) {
        const column = COLUMNS[key as keyof typeof COLUMNS]
        const implied = column
          ? column[preset.state.style]
          : DEFAULTS[key as keyof typeof DEFAULTS]
        expect(value, `${preset.id}.${key}`).not.toBe(implied)
      }
  })

  it("fire no rule: every value they write is the one that ships", () => {
    for (const preset of PRESETS) {
      const { explain } = effective(preset.state)
      const fired = Object.entries(explain)
        .filter(([, e]) => e?.rule)
        .map(([key, e]) => `${key}: ${e?.rule}`)
      expect(fired, preset.id).toEqual([])
    }
  })

  // A preset's output is pinned: a change that moves one updates the fixture on purpose.
  it("resolve to their pinned design systems", () => {
    expect(Object.keys(pinned).sort()).toEqual(
      PRESETS.map((preset) => preset.id).sort(),
    )
    for (const preset of PRESETS)
      expect(designSystemOf(preset.state), preset.id).toEqual(
        pinned[preset.id as keyof typeof pinned],
      )
  })

  it("credit the brand they recreate", () => {
    for (const preset of PRESETS)
      if (preset !== ORIGIN) expect(preset.inspiredBy, preset.id).toBeTruthy()
  })
})
