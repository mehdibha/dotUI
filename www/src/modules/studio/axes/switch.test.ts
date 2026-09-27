import { describe, expect, test } from "vitest"

import { defaultPreset } from "@/lib/registry-preset"
import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

const shipped = async (tokens: Record<string, string> = {}) => {
  const preset = defaultPreset()
  const mod = await publishables["switch"]?.()
  if (!mod) throw new Error("switch is not publishable")
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset: { ...preset, tokens: { ...preset.tokens, ...tokens } },
  })
  return item.files?.[0]?.content ?? ""
}

describe("switch motion", () => {
  test("ships shadcn's default transition: no timing class", async () => {
    const content = await shipped()
    expect(content).not.toMatch(/ (duration|ease)-/)
    expect(content).not.toContain("--studio-")
  })

  test("a tweak times the card, track and thumb together", async () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      switchMotion: { duration: 250, ease: [0, 0, 0.2, 1] },
    })
    const content = await shipped(tokens)
    expect(content.match(/ duration-250 ease-out/g)).toHaveLength(3)
  })
})
