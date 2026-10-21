import { describe, expect, it } from "vitest"

import { memoryStore } from "@/lib/snapshots/store"
import { getPreset } from "@/modules/presets"
import { SHAPES } from "@/modules/studio/axes/shape"

import {
  compareDesigns,
  identityCatalog,
  mintDesignSystem,
  pairingAxes,
  resolveDesign,
  resolveDirections,
  resolvePairings,
  resolveSwatches,
} from "./design"

describe("resolveDesign", () => {
  it("layers axes over the preset's diff", () => {
    const result = resolveDesign({ preset: "linear", axes: { radiusPx: 4 } })
    expect(result).toEqual({
      ok: true,
      value: { ...getPreset("linear")?.diff, radiusPx: 4 },
    })
  })

  it("puts the shape between the preset and the axes", () => {
    const result = resolveDesign({
      preset: "linear",
      shape: "sharp",
      axes: { roleCard: "md" },
    })
    expect(result).toEqual({
      ok: true,
      value: { ...getPreset("linear")?.diff, ...SHAPES.sharp, roleCard: "md" },
    })
  })

  it("names an unknown shape", () => {
    expect(resolveDesign({ shape: "blobby" as "sharp" })).toMatchObject({
      ok: false,
      problems: [expect.stringMatching(/shape: unknown "blobby".*square/)],
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

describe("resolveSwatches", () => {
  it("accepts any CSS color and names the bad ones", () => {
    expect(
      resolveSwatches([{ color: "#e8590c" }, { color: "oklch(0.5 0.2 30)" }]),
    ).toMatchObject({ ok: true })
    expect(resolveSwatches([{ color: "orangeish" }])).toMatchObject({
      ok: false,
      problems: [expect.stringMatching(/^candidates\[0\] "orangeish"/)],
    })
  })
})

describe("pairings", () => {
  it("suggests catalog families for a refused font", () => {
    const result = resolveDesign({ axes: { monoFont: "IBM Plex Mono" } })
    expect(result).toMatchObject({
      ok: false,
      problems: [
        expect.stringMatching(/monoFont: .*closest: .*JetBrains Mono/),
      ],
    })
  })

  it("checks every family against the font catalog", () => {
    expect(
      resolvePairings([{ heading: "Fraunces", body: "Not A Font" }]),
    ).toMatchObject({
      ok: false,
      problems: [expect.stringMatching(/^pairings\[0\]\.bodyFont/)],
    })
  })

  it("follows the body when heading and body match", () => {
    expect(pairingAxes({ heading: "Inter", body: "Inter" })).toEqual({
      headingFont: "same",
      bodyFont: "Inter",
    })
    expect(
      pairingAxes({
        heading: "Fraunces",
        body: "Inter",
        mono: "IBM Plex Mono",
      }),
    ).toEqual({
      headingFont: "Fraunces",
      bodyFont: "Inter",
      monoFont: "IBM Plex Mono",
    })
  })
})

describe("compareDesigns", () => {
  it("lists only what changes, named as the panel names it", () => {
    const changes = compareDesigns({}, { ...SHAPES.sharp, density: "compact" })
    const keys = changes.map((c) => c.key)
    expect(keys).toContain("radiusPx")
    expect(keys).toContain("density")
    expect(keys).not.toContain("brand")
    expect(changes.find((c) => c.key === "radiusPx")).toEqual({
      key: "radiusPx",
      from: "10",
      to: "6",
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
    expect(identityCatalog().fonts.mono).toContain("JetBrains Mono")
    expect(Object.keys(identityCatalog().shapes)).toEqual([
      "square",
      "sharp",
      "standard",
      "soft",
      "round",
    ])
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
    const init = `https://dotui.org/r/s/${id}/init.json`
    expect(result).toMatchObject({
      ok: true,
      value: {
        id,
        name: "Lumen",
        studioUrl: `https://dotui.org/studio?s=${id}`,
        initUrl: init,
        v0Url: `https://v0.app/chat/api/open?url=${encodeURIComponent(`https://dotui.org/r/s/${id}/v0.json`)}`,
        commands: {
          npm: `npx shadcn@latest init ${init}`,
          pnpm: `pnpm dlx shadcn@latest init ${init}`,
          bun: `bunx --bun shadcn@latest init ${init}`,
        },
      },
    })
    const saved = JSON.parse((await store.get(id)) ?? "{}")
    expect(saved.name).toBe("Lumen")
    expect(saved.state.brand).toBe("#0f766e")
  })
})
