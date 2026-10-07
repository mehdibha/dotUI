import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { DENSITIES } from "@/registry/types"
import { BUTTON_DENSITY } from "@/registry/ui/button/styles"
import { LIST_ROWS } from "@/registry/ui/list-box/styles"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import { DEFAULTS, parseState } from "./index"
import { DENSITY_TIERS } from "./space.meta"

const resolve = (overrides: Partial<typeof DEFAULTS>) =>
  designSystemOf(parseState({ ...overrides }))

const shipped = async (name: string, state: Record<string, unknown>) => {
  const ds = designSystemOf(parseState(state))
  const preset: PublishPreset = {
    density: ds.density,
    componentParams: ds.componentParams,
    tokens: ds.tokens,
    color: ds.color,
    icons: ds.icons,
  }
  const { item } = publish({
    publishable: selectPublishable(await publishables[name]!(), preset),
    preset,
  })
  return item.files?.[0]?.content ?? ""
}

const px = (classes: string, prefix: string) =>
  Number(new RegExp(`(?:^|\\s)${prefix}-(\\d+)\\b`).exec(classes)?.[1]) * 4

describe("space axis", () => {
  test("defaults emit nothing and the default tier", () => {
    const system = resolve({})
    expect(system.tokens).toEqual({})
    expect(system.density).toBe("default")
  })

  test("density selects a registry tier", () => {
    for (const density of DENSITIES)
      expect(resolve({ density }).density).toBe(density)
  })

  test("the panel's ladder is the button's", () => {
    for (const density of DENSITIES) {
      const sizes = BUTTON_DENSITY[density].variants.size
      const ladder = (["xs", "sm", "md", "lg"] as const).map((size) =>
        px(sizes[size], "h"),
      )
      expect(ladder, density).toEqual([...DENSITY_TIERS[density].ladder])
    }
  })

  test("the panel's list row is the list-box's", () => {
    const LINE: Record<string, number> = { "text-sm": 20, "text-base": 24 }
    for (const density of DENSITIES) {
      if (density === "compact") continue // a min-h-7 floor sets it
      const item = LIST_ROWS.density[density].slots.item
      const text = /text-(sm|base)\b/.exec(item)?.[0] ?? ""
      const py = Number(/(?:^|\s)py-([\d.]+)/.exec(item)?.[1]) * 4
      expect(py * 2 + (LINE[text] ?? 0), density).toBe(
        DENSITY_TIERS[density].row,
      )
    }
  })

  test("the ladder only grows, tier over tier", () => {
    for (const [i, density] of DENSITIES.entries()) {
      if (!i) continue
      const below = DENSITY_TIERS[DENSITIES[i - 1]!]
      const tier = DENSITY_TIERS[density]
      tier.ladder.forEach((h, rung) =>
        expect(h, `${density} rung ${rung}`).toBeGreaterThanOrEqual(
          below.ladder[rung]!,
        ),
      )
      expect(tier.row, density).toBeGreaterThanOrEqual(below.row)
    }
  })

  test("Spacious and Touch flatten to plain classes on export", async () => {
    for (const [density, md, field] of [
      ["spacious", "h-10", "--spacing(10)"],
      ["touch", "h-12", "--spacing(12)"],
    ] as const) {
      const button = await shipped("button", { density })
      expect(button, density).toContain(`md: "${md} `)
      const input = await shipped("input", { density })
      expect(input, density).toContain(`[--input-h:${field}]`)
      for (const content of [button, input]) {
        expect(content, density).not.toContain("--studio-")
        expect(content, density).not.toMatch(/\b(spacious|touch|comfortable):/)
      }
    }
  })
})
