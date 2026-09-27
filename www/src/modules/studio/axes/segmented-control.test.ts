import { describe, expect, test } from "vitest"

import { defaultPreset } from "@/lib/registry-preset"
import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

describe("segmented control axis", () => {
  test("defaults ship the registry defaults", () => {
    const { componentParams, tokens } = resolveDesignSystem(DEFAULTS)
    expect(componentParams["segmented-control"]).toEqual({
      selected: "flat",
      track: "filled",
    })
    expect(tokens).toEqual({})
  })

  test("selected and track become segmented-control params", () => {
    const { componentParams } = resolveDesignSystem({
      ...DEFAULTS,
      segmentedSelected: "raised",
      segmentedTrack: "outline",
    })
    expect(componentParams["segmented-control"]).toEqual({
      selected: "raised",
      track: "outline",
    })
  })

  test("unknown values fall back to the defaults", () => {
    const { componentParams } = resolveDesignSystem({
      ...DEFAULTS,
      segmentedSelected: "underline",
      segmentedTrack: "gapped",
    })
    expect(componentParams["segmented-control"]).toEqual({
      selected: "flat",
      track: "filled",
    })
  })
})

describe("segmented control motion", () => {
  const shipped = async (tokens: Record<string, string> = {}) => {
    const preset = defaultPreset()
    const mod = await publishables["segmented-control"]?.()
    if (!mod) throw new Error("segmented-control is not publishable")
    const { item } = publish({
      publishable: selectPublishable(mod, preset),
      preset: { ...preset, tokens: { ...preset.tokens, ...tokens } },
    })
    return item.files?.[0]?.content ?? ""
  }

  test("keeps today's glide: 150ms on ease-out, shipped as ease-out", async () => {
    const content = await shipped()
    expect(content).toContain(
      "transition-[translate,width,height] ease-out motion-reduce:transition-none",
    )
    expect(content).not.toMatch(/ duration-/)
    expect(content).not.toContain("--studio-")
  })

  test("a tweak ships plain classes", async () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      segmentedControlMotion: { duration: 200, ease: [0.4, 0, 0.2, 1] },
    })
    const content = await shipped(tokens)
    expect(content).toContain(
      "transition-[translate,width,height] duration-200 motion-reduce:transition-none",
    )
    expect(content).not.toMatch(/ ease-/)
  })
})
