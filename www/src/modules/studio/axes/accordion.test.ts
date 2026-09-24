import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"

import { DEFAULTS } from "."
import type { StudioState } from "."
import { resolveDesignSystem } from "../resolve"

/** What `name` ships under the studio state. */
async function shipped(name: string, state: StudioState = DEFAULTS) {
  const ds = resolveDesignSystem(state)
  const preset = {
    density: ds.density,
    componentParams: ds.componentParams,
    tokens: ds.tokens,
  }
  const mod = await publishables[name]?.()
  if (!mod) throw new Error(`${name} is not publishable`)
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset,
  })
  return item.files?.[0]?.content ?? ""
}

describe("accordion motion", () => {
  test("accordion and collapsible ship shadcn's expand", async () => {
    for (const name of ["accordion", "collapsible"]) {
      const content = await shipped(name)
      expect(content).toContain(
        "duration-200 ease-[cubic-bezier(0,0,0.58,1)] motion-safe:transition-[height]",
      )
      expect(content).not.toContain("opacity-0")
      expect(content).not.toContain("--studio-")
    }
  })

  test("one key retimes and repatterns both", async () => {
    const state: StudioState = {
      ...DEFAULTS,
      accordionMotion: {
        pattern: "fade",
        enter: 300,
        curve: { type: "easing", ease: [0, 0, 0.2, 1] },
      },
    }
    for (const name of ["accordion", "collapsible"]) {
      const content = await shipped(name, state)
      expect(content).toContain(
        "duration-300 ease-out opacity-0 group-expanded/",
      )
      expect(content).toContain("motion-safe:transition-[height,opacity]")
    }
  })
})
