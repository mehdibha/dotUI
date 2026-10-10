import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { parseState } from "."
import type { StudioState } from "."
import { designSystemOf } from "../resolve"
import { COMPONENT_MOTION_KEYS } from "./motion"

/* One item as users install it from a studio state. */
async function ship(name: string, state: Partial<StudioState> = {}) {
  const ds = designSystemOf(parseState({ ...state }))
  const preset: PublishPreset = {
    density: ds.density,
    componentParams: ds.componentParams,
    tokens: ds.tokens,
    color: ds.color,
    icons: ds.icons,
  }
  const mod = await publishables[name]?.()
  if (!mod) throw new Error(`${name} is not publishable`)
  const { item } = publish({
    publishable: selectPublishable(mod, preset),
    preset,
  })
  const code = (item.files ?? []).map((f) => f.content).join("\n")
  const css = JSON.stringify([item.css, item.cssVars])
  expect(code + css).not.toContain("--studio-")
  return { code, css }
}

/* Loops carry status: each recipe owns its cycle, nothing retimes it. */
describe("loops", () => {
  test("the spinners keep shadcn's 1s turn and their own mechanism", async () => {
    expect((await ship("loader")).code).toContain(
      'className="size-full animate-spin"',
    )
    const blades = await ship("loader", { spinnerStyle: "blades" })
    expect(blades.code).toContain("animate-loader-blades")
    expect(blades.css).toContain("loader-blades 1s steps(8, end) infinite")
    expect((await ship("loader", { spinnerStyle: "dots" })).css).toContain(
      "loader-dots 1s ease-in-out infinite",
    )
  })

  test("the skeleton loops on shadcn's animate-pulse timing", async () => {
    const { css } = await ship("skeleton")
    expect(css).toContain(
      '"--animate-skeleton-shimmer":"skeleton-shimmer 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"',
    )
    expect(css).toContain(
      '"--animate-skeleton-pulse":"skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"',
    )
  })

  test("an attachment in flight pulses like the skeleton", async () => {
    expect((await ship("attachment")).code).toContain(
      "group-data-[state=processing]/attachment:animate-pulse group-data-[state=uploading]/attachment:animate-pulse",
    )
  })

  test("every component Motion at None leaves the loops running", async () => {
    const off = Object.fromEntries(
      COMPONENT_MOTION_KEYS.map((k) => [k, "none"]),
    )
    const { css } = await ship("skeleton", off)
    expect(css).toContain("skeleton-shimmer 2s")
  })
})
