import { describe, expect, test } from "vitest"

import { defaultPreset } from "@/lib/registry-preset"
import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

const shipped = async (tokens: Record<string, string> = {}) => {
  const preset = defaultPreset()
  const mod = await publishables.questionnaire?.()
  if (!mod) throw new Error("questionnaire is not publishable")
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset: { ...preset, tokens: { ...preset.tokens, ...tokens } },
  })
  return item.files?.[0]?.content ?? ""
}

describe("questionnaire motion", () => {
  test("defaults write no tokens", () => {
    expect(resolveDesignSystem(DEFAULTS).tokens).toEqual({})
  })

  test("ships Tailwind's default timing: no duration or ease class", async () => {
    const content = await shipped()
    expect(content).toContain("text-start transition-colors select-ui")
    expect(content).toContain(
      "bg-field transition-[box-shadow,border-color,color] outline-none",
    )
    expect(content).not.toMatch(/ (duration|ease)-/)
    expect(content).not.toContain("--studio-")
  })

  test("a tweak times the choices and the text answer together", async () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      questionnaireMotion: { duration: 200, ease: [0, 0, 0.2, 1] },
    })
    const content = await shipped(tokens)
    expect(content).toContain(
      "transition-colors duration-200 ease-out select-ui",
    )
    expect(content).toContain(
      "transition-[box-shadow,border-color,color] duration-200 ease-out outline-none",
    )
  })
})
