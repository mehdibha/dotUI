import { describe, expect, it } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { resolveDesignSystem } from "../resolve"
import { DEFAULT_STATE, parseState } from "./index"

describe("links axis", () => {
  it("defaults to the registry's look: accent, no underline", () => {
    const system = resolveDesignSystem(DEFAULT_STATE)
    expect(system.componentParams.link).toEqual({
      underline: "never",
      color: "accent",
    })
    expect(system.tokens).toEqual({})
  })

  it("maps both axes onto the link params", () => {
    const system = resolveDesignSystem(
      parseState({ linkUnderline: "hover", linkColor: "neutral" }),
    )
    expect(system.componentParams.link).toEqual({
      underline: "hover",
      color: "neutral",
    })
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

describe("link motion", () => {
  it("ships shadcn's default timing: no duration or ease class", async () => {
    const content = await shipped("link")
    expect(content).toContain('gap-1 transition-colors"')
    expect(content).not.toMatch(/ (duration|ease)-/)
    expect(content).not.toContain("--studio-")
  })

  it("a tweak times the hover color", async () => {
    const { tokens } = resolveDesignSystem(
      parseState({ linkMotion: { duration: 200, ease: [0, 0, 0.2, 1] } }),
    )
    expect(await shipped("link", tokens)).toContain(
      "gap-1 transition-colors duration-200 ease-out",
    )
  })
})
