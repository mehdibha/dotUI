import { describe, expect, it } from "vitest"

import {
  DEFAULT_STATE,
  DEFAULTS,
  effective,
  validate,
} from "@/modules/studio/axes"
import { LOOKS, STYLE_KEYS } from "@/modules/studio/axes/style"

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
        const implied = (STYLE_KEYS as readonly string[]).includes(key)
          ? LOOKS[preset.state.style][key as (typeof STYLE_KEYS)[number]]
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

  it("credit the brand they recreate", () => {
    for (const preset of PRESETS)
      if (preset !== ORIGIN) expect(preset.inspiredBy, preset.id).toBeTruthy()
  })
})
