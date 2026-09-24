import { describe, expect, test } from "vitest"

import { defaultPreset } from "@/lib/registry-preset"
import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

const shipped = async (tokens: Record<string, string> = {}) => {
  const preset = defaultPreset()
  const mod = await publishables["progress-bar"]?.()
  if (!mod) throw new Error("progress-bar is not publishable")
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset: { ...preset, tokens: { ...preset.tokens, ...tokens } },
  })
  return item.files?.[0]?.content ?? ""
}

describe("progress motion", () => {
  test("ships shadcn's default fill transition: no timing class", async () => {
    const content = await shipped()
    expect(content).toContain("bg-primary transition-all")
    expect(content).not.toMatch(/ (duration|ease)-/)
    expect(content).not.toContain("--studio-")
  })

  test("a tweak times the fill", async () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      progressMotion: { duration: 500, ease: [0.05, 0.7, 0.1, 1] },
    })
    expect(await shipped(tokens)).toContain(
      "transition-all duration-500 ease-[cubic-bezier(0.05,0.7,0.1,1)]",
    )
  })
})
