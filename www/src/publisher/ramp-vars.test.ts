import { describe, expect, it } from "vitest"

import { baseRegistryCss } from "@/registry/__generated__/base-css"
import {
  publishables,
  PUBLISHABLE_NAMES,
} from "@/registry/__generated__/publishables"
import { PRESETS, resolvePreset } from "@/modules/presets"

import { emitInitItem } from "./emit-theme"
import { publish, selectPublishable } from "./publish"
import { assertNoRampVars, assertNoStudioVars } from "./resolve-classes"

describe("palette ramps never ship", () => {
  it("catches a ramp step and lets chart slots through", () => {
    expect(() => assertNoRampVars("border-(--neutral-700)", "x")).toThrow(
      /--neutral-700/,
    )
    expect(() => assertNoRampVars("text-(--on-accent-700)", "x")).toThrow(
      /--on-accent-700/,
    )
    expect(() => assertNoRampVars("ring-(--selection-300)/50", "x")).toThrow(
      /--selection-300/,
    )
    expect(() =>
      assertNoRampVars("fill-(--chart-1) text-2xl border-fg-muted", "x"),
    ).not.toThrow()
  })

  it.each(PRESETS.map((p) => p.id))(
    "%s: every item and the init item read semantic tokens",
    async (id) => {
      const preset = resolvePreset(id)
      for (const name of PUBLISHABLE_NAMES) {
        const mod = await publishables[name]?.()
        if (!mod) throw new Error(`${name} is not publishable`)
        const { item } = publish({
          publishable: selectPublishable(mod, preset),
          preset,
        })
        assertNoRampVars(JSON.stringify(item), name)
      }
      const init = emitInitItem({
        baseRegistryCss,
        preset,
        itemUrl: (n) => `https://dotui.org/r/${n}.json`,
      })
      assertNoRampVars(JSON.stringify(init), "init")
    },
  )

  it("every param value at Origin ships no ramp or studio var", async () => {
    const origin = resolvePreset("origin")
    for (const name of PUBLISHABLE_NAMES) {
      const mod = await publishables[name]?.()
      if (!mod) continue
      for (const [param, def] of Object.entries(
        mod.publishable.meta.params ?? {},
      ))
        for (const value of def.kind === "enum" ? def.values : []) {
          const preset = {
            ...origin,
            componentParams: {
              ...origin.componentParams,
              [name]: { ...origin.componentParams[name], [param]: value },
            },
          }
          const { item } = publish({
            publishable: selectPublishable(mod, preset),
            preset,
          })
          const text = JSON.stringify(item)
          assertNoRampVars(text, `${name}.${param}=${value}`)
          assertNoStudioVars(text, `${name}.${param}=${value}`)
        }
    }
  })
})
