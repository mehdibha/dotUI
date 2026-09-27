import { describe, expect, test } from "vitest"

import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"
import type { PublishPreset } from "@/publisher/types"

import { DEFAULTS } from "."
import type { StudioState } from "."
import { resolveDesignSystem } from "../resolve"
import { ease } from "./motion"

/* One item as users install it from a studio state. */
async function ship(name: string, state: Partial<StudioState> = {}) {
  const ds = resolveDesignSystem({ ...DEFAULTS, ...state })
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

describe("spinner motion", () => {
  test("the defaults write no tokens", () => {
    expect(resolveDesignSystem(DEFAULTS).tokens).toEqual({})
  })

  test("the ring ships shadcn's animate-spin", async () => {
    const { code } = await ship("loader")
    expect(code).toContain('className="size-full animate-spin"')
  })

  test("a tweak times the ring's turn with an arbitrary animation", async () => {
    const { code } = await ship("loader", {
      loaderMotion: { cycle: 600, ease: ease("ease-in-out") },
    })
    expect(code).toContain(
      "animate-[spin_600ms_cubic-bezier(0.4,0,0.2,1)_infinite]",
    )
  })

  test("blades and dots keep their mechanism, on the loop's cycle", async () => {
    const blades = await ship("loader", {
      spinnerStyle: "blades",
      loaderMotion: { cycle: 700, ease: ease("ease-in-out") },
    })
    expect(blades.code).toContain("animate-loader-blades")
    expect(blades.css).toContain("loader-blades 700ms steps(8, end) infinite")
    expect(blades.css).toContain("loader-dots 700ms ease-in-out infinite")
    expect((await ship("loader", { spinnerStyle: "dots" })).css).toContain(
      "loader-dots 1000ms ease-in-out infinite",
    )
  })
})

describe("skeleton motion", () => {
  test("the defaults loop on shadcn's animate-pulse timing", async () => {
    const { css } = await ship("skeleton")
    // Theme animations: Tailwind drops a theme keyframe nothing names, and
    // the painter only reaches its loop through a var.
    expect(css).toContain(
      '"--animate-skeleton-shimmer":"skeleton-shimmer 2000ms cubic-bezier(0.4, 0, 0.6, 1) infinite"',
    )
    expect(css).toContain(
      '"--animate-skeleton-pulse":"skeleton-pulse 2000ms cubic-bezier(0.4, 0, 0.6, 1) infinite"',
    )
    expect(css).toContain(
      '"--skeleton-animation":"var(--animate-skeleton-shimmer)"',
    )
  })

  test("a tweak retimes the skeleton's loop", async () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      skeletonMotion: { cycle: 1200, ease: ease("ease-in-out") },
    })
    expect(tokens).toEqual({
      "--studio-skeleton-loop-duration": "1200ms",
      "--studio-skeleton-loop-ease": "cubic-bezier(0.4, 0, 0.2, 1)",
    })
    const { css } = await ship("skeleton", {
      skeletonMotion: { cycle: 1200, ease: ease("ease-in-out") },
    })
    expect(css).toContain(
      "skeleton-pulse 1200ms cubic-bezier(0.4, 0, 0.2, 1) infinite",
    )
  })

  test("an attachment in flight pulses on the skeleton's loop", async () => {
    expect((await ship("attachment")).code).toContain(
      "group-data-[state=processing]/attachment:animate-pulse group-data-[state=uploading]/attachment:animate-pulse",
    )
    const { code } = await ship("attachment", {
      skeletonMotion: { cycle: 1200, ease: ease("ease-in-out") },
    })
    expect(code).toContain(
      "group-data-[state=uploading]/attachment:animate-[pulse_1200ms_cubic-bezier(0.4,0,0.2,1)_infinite]",
    )
  })
})
