import { describe, expect, it } from "vitest"

import { lstarOf, STATUS_SEEDS, toOklch } from "@dotui/colors"

import { COLOR_DEFAULTS, SEMANTIC_PICKS } from "./axes/color"
import {
  atTone,
  clashFor,
  findClashes,
  isMoved,
  parseSeed,
  seedHex,
  shipped,
  shippedTone,
  TONE_MAX,
  withHue,
} from "./semantic-seeds"

const STARTS = [
  STATUS_SEEDS.success,
  STATUS_SEEDS.warning,
  STATUS_SEEDS.danger,
  COLOR_DEFAULTS.brand,
  ...Object.values(SEMANTIC_PICKS).flatMap((picks) => picks.map((p) => p.hex)),
]

describe("parseSeed", () => {
  it.each([
    ["#46a758", "#46A758"],
    ["46a758", "#46A758"],
    ["#fed", "#FFEEDD"],
    ["#46a75880", "#46A758"],
    ["rgb(70 167 88)", "#46A758"],
    ["red", "#FF0000"],
    ["--danger: oklch(0.6 0.2 25);", "#DE3B3D"],
    ["'#0072f5'", "#0072F5"],
  ])("%s → %s", (raw, hex) => expect(parseSeed(raw)).toBe(hex))

  it("rejects what isn't a color", () => {
    expect(parseSeed("hello world")).toBeNull()
    expect(parseSeed("#fed261E")).toBeNull()
  })
})

describe("tone", () => {
  for (const vividness of [0.5, 1, 2]) {
    it(`ships where the thumb rests at vividness ${vividness}`, () => {
      for (const start of STARTS) {
        const { c, h } = toOklch(start)
        for (let tone = 0; tone <= TONE_MAX; tone++) {
          const seed = seedHex(atTone(tone, c, h, vividness))
          expect(shippedTone(seed, vividness), `${start} at ${tone}`).toBe(tone)
        }
      }
    })
  }
})

describe("hue", () => {
  it("moves from every Auto and pick ship as themselves", () => {
    for (const start of STARTS) {
      const base = toOklch(start)
      const tone = shippedTone(start)
      for (let h = 0; h < 360; h += 5) {
        const seed = seedHex(withHue(base, base.c, h, tone))
        expect(isMoved(seed, shipped(seed).solid), `${start} → ${h}°`).toBe(
          false,
        )
      }
    }
  })

  it("holds a moved seed's tone", () => {
    const base = toOklch(STATUS_SEEDS.success)
    const tone = shippedTone(STATUS_SEEDS.success)
    for (let h = 0; h < 360; h += 15) {
      const seed = seedHex(withHue(base, base.c, h, tone))
      expect(shippedTone(seed)).toBe(tone)
      expect(lstarOf(toOklch(shipped(seed).solid))).toBeLessThan(62)
    }
  })
})

describe("health", () => {
  const solids = {
    success: "#16a34a",
    warning: "#eab308",
    danger: "#dc2626",
    selection: "#0072f5",
    info: "#4862ff",
    brand: "#0072f5",
  }

  it("names the other party", () => {
    const clashes = findClashes({ ...solids, success: "#dc2828" })
    expect(clashFor(clashes, "success")?.label).toBe("Close to Danger")
    expect(clashFor(clashes, "warning")).toBeUndefined()
  })

  it("reads a selection that is the brand as the brand", () => {
    const red = { ...solids, selection: "#dc2828", brand: "#dc2828" }
    const clashes = findClashes(red)
    expect(clashFor(clashes, "danger")?.label).toBe("Close to brand")
    expect(clashFor(clashes, "selection")).toBeUndefined()
    const seeded = findClashes({ ...red, brand: "#0072f5" })
    expect(clashFor(seeded, "danger")?.label).toBe("Close to Selection")
  })
})
