import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { designSystemOf } from "../resolve"
import { parseState } from "./index"

const shipped = async (
  name: string,
  tokens: Record<string, string> = {},
  componentParams: PublishPreset["componentParams"] = {},
) => {
  const preset: PublishPreset = { density: "default", componentParams }
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
    const { tokens } = designSystemOf(
      parseState({ buttonMotion: { duration: 200, ease: [0, 0, 0.2, 1] } }),
    )
    for (const name of ["button", "toggle-button"])
      expect(await shipped(name, tokens)).toContain(
        "transition-[background-color,border-color,color,box-shadow,filter,scale,translate] duration-200 ease-out select-ui",
      )
  })
})

/* A class only that style's recipe uses. */
const SIGNATURE: Record<string, string> = {
  hairline: "border-black/15",
  "rim-light": "after:mask-b-from-0%",
  gloss: "after:from-white/11",
  bevel: "from-63%",
  ledge: "pressed:translate-y-0.5",
}

describe("button styles", () => {
  test("each style ships its own recipe and no other's", async () => {
    for (const name of ["button", "toggle-button"])
      for (const style of ["flat", ...Object.keys(SIGNATURE)]) {
        const content = await shipped(name, {}, { [name]: { style } })
        for (const [other, signature] of Object.entries(SIGNATURE))
          expect(content.includes(signature), `${name}/${style}`).toBe(
            other === style,
          )
        expect(content).not.toContain("--studio-")
      }
  })
})
