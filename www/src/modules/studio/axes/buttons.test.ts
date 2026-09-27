import { describe, expect, test } from "vitest"

import { defaultPreset } from "@/lib/registry-preset"
import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

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

describe("button motion", () => {
  test("ships shadcn's default timing: no duration or ease class", async () => {
    for (const name of ["button", "toggle-button"]) {
      const content = await shipped(name)
      expect(content).toContain(
        "transition-[background-color,border-color,color,box-shadow,filter,scale,translate] select-ui",
      )
      expect(content).not.toMatch(/ (duration|ease)-/)
      expect(content).not.toContain("--studio-")
    }
  })

  test("one tweak times button and toggle alike", async () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      buttonMotion: { duration: 200, ease: [0, 0, 0.2, 1] },
    })
    for (const name of ["button", "toggle-button"])
      expect(await shipped(name, tokens)).toContain(
        "transition-[background-color,border-color,color,box-shadow,filter,scale,translate] duration-200 ease-out select-ui",
      )
  })
})
