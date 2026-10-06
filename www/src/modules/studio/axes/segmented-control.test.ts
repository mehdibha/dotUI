import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("segmented control axis", () => {
  test("defaults ship the registry defaults", () => {
    const { componentParams, tokens } = designSystemOf(DEFAULT_STATE)
    expect(componentParams["segmented-control"]).toEqual({
      selected: "flat",
      track: "filled",
    })
    expect(tokens).toEqual({})
  })

  test("selected and track become segmented-control params", () => {
    const { componentParams } = designSystemOf(
      parseState({ segmentedSelected: "raised", segmentedTrack: "outline" }),
    )
    expect(componentParams["segmented-control"]).toEqual({
      selected: "raised",
      track: "outline",
    })
  })
})

describe("segmented control motion", () => {
  const shipped = async (tokens: Record<string, string> = {}) => {
    const preset: PublishPreset = { density: "default", componentParams: {} }
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
    const { tokens } = designSystemOf(
      parseState({
        segmentedControlMotion: { duration: 200, ease: [0.4, 0, 0.2, 1] },
      }),
    )
    const content = await shipped(tokens)
    expect(content).toContain(
      "transition-[translate,width,height] duration-200 motion-reduce:transition-none",
    )
    expect(content).not.toMatch(/ ease-/)
  })
})
