import { describe, expect, test } from "vitest"

import { defaultPreset } from "@/lib/registry-preset"
import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

const shipped = async (tokens: Record<string, string> = {}) => {
  const preset = defaultPreset()
  const mod = await publishables["message-scroller"]?.()
  if (!mod) throw new Error("message-scroller is not publishable")
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset: { ...preset, tokens: { ...preset.tokens, ...tokens } },
  })
  return item.files?.[0]?.content ?? ""
}

describe("message scroller motion", () => {
  test("defaults write no tokens", () => {
    expect(resolveDesignSystem(DEFAULTS).tokens).toEqual({})
  })

  test("ships today's timing: a quick ease-out in, a slower ease-in out", async () => {
    const content = await shipped()
    expect(content).toContain(
      "transition-[translate,scale,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)]",
    )
    expect(content).not.toContain("--studio-")
  })

  test("an exit equal to the enter ships no inactive timing", async () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      messageScrollerMotion: {
        pattern: "slide",
        enter: 300,
        curve: { type: "easing", ease: [0, 0, 0.2, 1] },
        exit: 300,
        exitEase: [0, 0, 0.2, 1],
      },
    })
    const content = await shipped(tokens)
    expect(content).toContain(
      "transition-[translate,scale,opacity] duration-300 ease-out data-[active=false]:pointer-events-none",
    )
    expect(content).not.toMatch(/data-\[active=false\]:(duration|ease)-/)
  })

  test("a spring enter ships linear() over its settle time", async () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      messageScrollerMotion: {
        ...DEFAULTS.messageScrollerMotion,
        curve: { type: "spring", bounce: 0.2 },
      },
    })
    expect(tokens["--studio-message-scroller-ease"]).toMatch(/^linear\(/)
    const content = await shipped(tokens)
    expect(content).toMatch(/ ease-\[linear\(0,/)
    expect(content).not.toContain("--studio-")
  })
})
