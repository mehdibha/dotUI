import { describe, expect, it } from "vitest"

import { memoryStore } from "@/lib/snapshots/store"
import { getPreset } from "@/modules/presets"

import {
  identityCatalog,
  mintDesignSystem,
  resolveDesign,
  resolveDirections,
} from "./directions"

describe("resolveDesign", () => {
  it("layers axes over the preset's diff", () => {
    const result = resolveDesign({ preset: "linear", axes: { radiusPx: 4 } })
    expect(result).toEqual({
      ok: true,
      value: { ...getPreset("linear")?.diff, radiusPx: 4 },
    })
  })

  it("names an unknown preset and lists the real ones", () => {
    expect(resolveDesign({ preset: "nope" })).toMatchObject({
      ok: false,
      problems: [expect.stringMatching(/unknown "nope".*linear/)],
    })
  })

  it("reports bad and unknown keys", () => {
    expect(resolveDesign({ axes: { radiusPx: 99, glow: true } })).toEqual({
      ok: false,
      problems: ["radiusPx: expected 2–20", "glow: unknown key"],
    })
  })
})

describe("resolveDirections", () => {
  it("prefixes problems with the direction", () => {
    const result = resolveDirections([
      { name: "A", summary: "fine", preset: "vercel" },
      { name: "B", summary: "broken", axes: { style: "glossy" } },
    ])
    expect(result).toMatchObject({
      ok: false,
      problems: [expect.stringMatching(/^B → style: /)],
    })
  })
})

describe("identityCatalog", () => {
  it("lists identity axes only, with their values", () => {
    const { axes, presets } = identityCatalog()
    const keys = axes.map((a) => a.key)
    expect(keys).toContain("brand")
    expect(keys).toContain("radiusPx")
    expect(keys).toContain("motion")
    expect(keys).not.toContain("buttonMotion")
    expect(axes.every((a) => a.chapter !== "buttons")).toBe(true)
    expect(presets.map((p) => p.id)).toContain("linear")
  })
})

describe("mintDesignSystem", () => {
  it("stores a snapshot and returns its install command", async () => {
    const store = memoryStore()
    const result = await mintDesignSystem(
      { name: "Lumen", preset: "linear", axes: { brand: "#0f766e" } },
      store,
      "https://dotui.org",
    )
    const id = result.ok ? result.value.id : ""
    expect(result).toEqual({
      ok: true,
      value: {
        id,
        name: "Lumen",
        studioUrl: `https://dotui.org/studio?s=${id}`,
        initUrl: `https://dotui.org/r/s/${id}/init.json`,
        installCommand: `npx shadcn@latest init https://dotui.org/r/s/${id}/init.json`,
      },
    })
    const saved = JSON.parse((await store.get(id)) ?? "{}")
    expect(saved.name).toBe("Lumen")
    expect(saved.state.brand).toBe("#0f766e")
  })
})
