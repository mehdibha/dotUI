import { describe, expect, test } from "vitest"

import { defaultPreset } from "@/lib/registry-preset"
import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

const shipped = async (tokens: Record<string, string> = {}) => {
  const preset = defaultPreset()
  const mod = await publishables["tabs"]?.()
  if (!mod) throw new Error("tabs is not publishable")
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset: { ...preset, tokens: { ...preset.tokens, ...tokens } },
  })
  return item.files?.[0]?.content ?? ""
}

describe("tabs motion", () => {
  test("ships shadcn's default transition: no timing class", async () => {
    const content = await shipped()
    expect(content).toContain(
      "pointer-events-none absolute transition-[translate,width,height] motion-reduce:transition-none",
    )
    expect(content).not.toMatch(/ (duration|ease)-/)
    expect(content).not.toContain("--studio-")
  })

  test("a tweak times the tab and its indicator together", async () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      tabsMotion: { duration: 300, ease: [0.23, 1, 0.32, 1] },
    })
    const content = await shipped(tokens)
    const timing = "duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
    expect(content).toContain(
      `transition-[background-color,border-color,color,box-shadow] ${timing}`,
    )
    expect(content).toContain(`transition-[translate,width,height] ${timing}`)
  })
})
