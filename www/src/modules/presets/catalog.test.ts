import { createHash } from "node:crypto"
import { describe, expect, it } from "vitest"

import { DEFAULTS, validateState } from "@/modules/studio/axes"
import { migrate, VERSION } from "@/modules/studio/preset/migrations"
import { resolveDesignSystem } from "@/modules/studio/resolve"

import { PRESET_CATALOG } from "./__generated__/catalog"
import { loadRevision, REVISIONS } from "./built-ins"
import type { PresetRevision } from "./built-ins"
import { ORIGIN, PRESETS } from "./catalog"

/* A published revision is immutable: links and installs pin it. To change a
   preset, append a revision to revisions/<id>.json and pin its hash here. */
const PINNED: Record<string, string> = {
  "origin@1": "cdde4a622ecb19ad",
  "claude@1": "7d1c14de2540f492",
  "claude@2": "b38c6ef00f260d0d",
  "supabase@1": "f66f0c99c49017eb",
  "supabase@2": "8cfe1a43b7866d46",
  "stripe@1": "a6a41413f0ca596b",
  "stripe@2": "f1b978410c8880dc",
  "linear@1": "77f7226d9f56f447",
  "linear@2": "3ec570ce78cf3aed",
  "vercel@1": "6ce976902dcfcb83",
  "vercel@2": "62daa0e41d057da1",
  "airbnb@1": "a24b46befbfe8d5d",
  "airbnb@2": "dc1a95f54a2b2ce2",
  "github@1": "9baa7e9f54c5d2ae",
  "github@2": "065b2e4daa9183d4",
  "notion@1": "5288d7c7b6426f84",
  "notion@2": "131afac9a4987928",
  "spotify@1": "93cf711c969d4fd4",
  "spotify@2": "d4848cbf43ca403f",
}

/** JSON with sorted keys, so the hash tracks content, not layout. */
function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`
  if (value && typeof value === "object")
    return `{${Object.keys(value)
      .sort()
      .map(
        (key) =>
          `${JSON.stringify(key)}:${canonical((value as Record<string, unknown>)[key])}`,
      )
      .join(",")}}`
  return JSON.stringify(value)
}

const hash = (revision: PresetRevision) =>
  createHash("sha256").update(canonical(revision)).digest("hex").slice(0, 16)

describe("preset catalog", () => {
  it("pins every published revision", () => {
    const published = Object.fromEntries(
      Object.entries(REVISIONS).flatMap(([id, revisions]) =>
        revisions.map((revision) => [`${id}@${revision.rev}`, hash(revision)]),
      ),
    )
    expect(published).toEqual(PINNED)
  })

  it("numbers revisions 1…n in codec versions it can read", () => {
    for (const revisions of Object.values(REVISIONS)) {
      expect(revisions.map((r) => r.rev)).toEqual(
        revisions.map((_, i) => i + 1),
      )
      for (const { version } of revisions) {
        expect(version).toBeGreaterThanOrEqual(3)
        expect(version).toBeLessThanOrEqual(VERSION)
      }
    }
  })

  it("stores full, valid states", () => {
    for (const revisions of Object.values(REVISIONS))
      for (const revision of revisions) {
        const lifted = migrate(revision.state, revision.version, [])
        expect(validateState(lifted)).toEqual({ state: lifted, dropped: [] })
      }
  })

  it("loads every latest revision without dropping a setting", () => {
    for (const preset of PRESETS) {
      const latest = REVISIONS[preset.id]?.at(-1)
      if (!latest) throw new Error(preset.id)
      expect(latest.rev).toBe(preset.rev)
      expect(loadRevision(latest)).toEqual({ state: preset.state, dropped: [] })
    }
  })

  it("rejects a revision from a newer codec", () => {
    expect(() =>
      loadRevision({ rev: 1, version: VERSION + 1, state: {} }),
    ).toThrow("from codec v")
  })

  it("names presets by a URL-safe, unique id", () => {
    const ids = PRESETS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/)
    expect(ORIGIN.id).toBe("origin")
  })

  it("makes origin@latest the axis defaults", () => {
    expect(ORIGIN.state).toEqual(DEFAULTS)
    // …so it ships the base palette (`base/colors.css`) and no tokens.
    expect(ORIGIN.designSystem.color).toBeUndefined()
    expect(ORIGIN.designSystem.tokens).toEqual({})
  })

  it("credits the brand of every preset but Origin", () => {
    for (const preset of PRESETS)
      expect(Boolean(preset.inspiredBy)).toBe(preset !== ORIGIN)
  })

  it("resolves each preset from its state", () => {
    for (const preset of PRESETS)
      expect(preset.designSystem).toEqual(resolveDesignSystem(preset.state))
  })

  it("precomputes the same catalog (pnpm build:registry)", () => {
    expect(PRESET_CATALOG).toEqual(PRESETS.map(({ state: _, ...rest }) => rest))
  })
})
