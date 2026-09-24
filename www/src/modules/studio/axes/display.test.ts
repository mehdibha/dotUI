import { describe, expect, it } from "vitest"

import { defaultPreset } from "@/lib/registry-preset"
import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"

import { DEFAULTS } from "."
import { resolveDesignSystem } from "../resolve"

describe("display chapters (badges, kbd, avatars)", () => {
  it("defaults resolve to the registry defaults and no tokens", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.tokens).toEqual({})
    expect(ds.componentParams.badge).toEqual({ style: "solid" })
    expect(ds.componentParams["tag-group"]).toEqual({ style: "solid" })
    expect(ds.componentParams.kbd).toEqual({ treatment: "chip" })
    expect(ds.componentParams.avatar).toEqual({ fallback: "neutral" })
  })

  it("badge style writes badge and tag-group together", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, badgeStyle: "soft-outline" })
    expect(ds.componentParams.badge?.style).toBe("soft-outline")
    expect(ds.componentParams["tag-group"]?.style).toBe("soft-outline")
  })

  it("badge shape re-points the badge and tag radius vars", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, badgeShape: "rounded" })
    expect(ds.tokens).toEqual({
      "--studio-badge-radius": "var(--radius-sm)",
      "--studio-tag-radius": "var(--radius-sm)",
    })
  })

  it("kbd treatment lands on the kbd param", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, kbdTreatment: "keycap" })
    expect(ds.componentParams.kbd).toEqual({ treatment: "keycap" })
  })

  it("avatar shape and fallback land on the var and the param", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      avatarShape: "rounded",
      avatarFallback: "tinted",
    })
    expect(ds.tokens).toEqual({ "--studio-avatar-radius": "var(--radius-lg)" })
    expect(ds.componentParams.avatar).toEqual({ fallback: "tinted" })
  })

  it("unknown values fall back to the defaults", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      badgeStyle: "neon",
      kbdTreatment: "glow",
      avatarFallback: "rainbow",
    })
    expect(ds.componentParams.badge?.style).toBe("solid")
    expect(ds.componentParams.kbd?.treatment).toBe("chip")
    expect(ds.componentParams.avatar?.fallback).toBe("neutral")
  })
})

const shipped = async (name: string, tokens: Record<string, string> = {}) => {
  const preset = defaultPreset()
  const mod = await publishables[name]?.()
  if (!mod) throw new Error(`${name} is not publishable`)
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset: { ...preset, tokens: { ...preset.tokens, ...tokens } },
  })
  return item.files?.[0]?.content ?? ""
}

describe("tag motion", () => {
  it("ships shadcn's default timing: no duration or ease class", async () => {
    const content = await shipped("tag-group")
    expect(content).toContain("transition-colors select-ui")
    expect(content).not.toMatch(/ (duration|ease)-/)
    expect(content).not.toContain("--studio-")
  })

  it("a tweak times the tag's hover", async () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      tagMotion: { duration: 200, ease: [0, 0, 0.2, 1] },
    })
    expect(await shipped("tag-group", tokens)).toContain(
      "transition-colors duration-200 ease-out select-ui",
    )
  })
})
