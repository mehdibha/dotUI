import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"

import { DEFAULTS } from "."
import type { StudioState } from "."
import { resolveDesignSystem } from "../resolve"

async function shipped(state: StudioState = DEFAULTS) {
  const ds = resolveDesignSystem(state)
  const preset = {
    density: ds.density,
    componentParams: ds.componentParams,
    tokens: ds.tokens,
  }
  const mod = await publishables["sidebar"]?.()
  if (!mod) throw new Error("sidebar is not publishable")
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset,
  })
  return item.files?.[0]?.content ?? ""
}

describe("sidebar motion", () => {
  test("ships shadcn's 200ms linear collapse", async () => {
    const content = await shipped()
    expect(content).toContain("transition-[width] duration-200 ease-linear")
    expect(content).toContain(
      "transition-[left,right,width] md:flex duration-200 ease-linear",
    )
    expect(content).toContain("transition-all ease-linear")
    expect(content).not.toContain("--studio-")
  })

  test("Tailwind's default timing ships no class", async () => {
    const content = await shipped({
      ...DEFAULTS,
      sidebarMotion: { duration: 150, ease: [0.4, 0, 0.2, 1] },
    })
    expect(content).not.toMatch(/duration-150|ease-in-out|ease-linear/)
  })
})
