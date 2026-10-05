import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { resolveDesignSystem } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("sliders axis", () => {
  test("defaults resolve to the registry defaults and no tokens", () => {
    const ds = resolveDesignSystem(DEFAULT_STATE)
    expect(ds.componentParams.slider).toEqual({
      thumb: "circle",
      track: "thin",
    })
    expect(ds.tokens).toEqual({})
  })

  test("thumb and track land as slider params", () => {
    const ds = resolveDesignSystem(
      parseState({ sliderThumb: "bar", sliderTrack: "thick" }),
    )
    expect(ds.componentParams.slider).toEqual({ thumb: "bar", track: "thick" })
    expect(ds.tokens).toEqual({})
  })

  test("the fill leaves the buttons' source through the slider fill var", () => {
    expect(
      resolveDesignSystem(parseState({ sliderColor: "neutral" })).tokens,
    ).toEqual({ "--studio-slider-fill-color": "var(--color-inverse)" })
    expect(
      resolveDesignSystem(parseState({ buttonColor: "neutral" })).tokens,
    ).toEqual({ "--studio-slider-fill-color": "var(--color-accent)" })
    expect(
      resolveDesignSystem(
        parseState({ buttonColor: "neutral", sliderColor: "neutral" }),
      ).tokens,
    ).toEqual({})
  })
})

const shipped = async (name: string, tokens: Record<string, string> = {}) => {
  const preset: PublishPreset = { density: "default", componentParams: {} }
  const mod = await publishables[name]?.()
  if (!mod) throw new Error(`${name} is not publishable`)
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset: { ...preset, tokens: { ...preset.tokens, ...tokens } },
  })
  return item.files?.[0]?.content ?? ""
}

describe("slider motion", () => {
  test("ships shadcn's default timing: no duration or ease class", async () => {
    const content = await shipped("slider")
    expect(content).toContain("transition-shadow focus-visible:focus-ring")
    expect(content).not.toMatch(/ (duration|ease)-/)
    expect(content).not.toContain("--studio-")
  })

  test("a tweak times the thumb's focus ring", async () => {
    const { tokens } = resolveDesignSystem(
      parseState({ sliderMotion: { duration: 200, ease: [0, 0, 0.2, 1] } }),
    )
    expect(await shipped("slider", tokens)).toContain(
      "transition-shadow duration-200 ease-out focus-visible:focus-ring",
    )
  })
})
