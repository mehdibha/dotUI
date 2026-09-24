import { describe, expect, it } from "vitest"

import { defaultPreset } from "@/lib/registry-preset"
import { publishables } from "@/registry/__generated__/publishables"
import { publish, selectPublishable } from "@/publisher/publish"

import { resolveDesignSystem } from "../resolve"
import { DEFAULTS } from "./index"

describe("selection controls", () => {
  it("defaults resolve to no tokens and the registry's card params", () => {
    const ds = resolveDesignSystem(DEFAULTS)
    expect(ds.tokens).toEqual({})
    for (const component of ["checkbox", "radio-group"]) {
      expect(ds.componentParams[component]).toEqual({
        "card-selected": "tint",
        "card-control": "start",
      })
    }
    expect(ds.componentParams.switch).toEqual({ "card-selected": "tint" })
  })

  it("a control's fill forks it off the selection tokens as a recipe scope", () => {
    const ds = resolveDesignSystem({ ...DEFAULTS, switchColor: "accent" })
    expect(ds.tokens).toEqual({})
    expect(ds.color?.scopes).toEqual({ switch: "accent" })
    expect(
      resolveDesignSystem({
        ...DEFAULTS,
        checkboxColor: "neutral",
        radioColor: "accent",
        switchColor: "accent",
      }).color?.scopes,
    ).toEqual({ radio: "accent", switch: "accent" })
  })

  it("a fill matching the selection source is no fork", () => {
    expect(
      resolveDesignSystem({ ...DEFAULTS, checkboxColor: "neutral" }).color,
    ).toBeUndefined()
    const accentChecks = resolveDesignSystem({
      ...DEFAULTS,
      selectionColor: "accent",
      checkboxColor: "accent",
    }).color
    expect(accentChecks?.selection).toBe("accent")
    expect(accentChecks?.scopes).toEqual({
      radio: "neutral",
      switch: "neutral",
    })
    // A selection seed paints the selection leaf; a control on that leaf
    // follows it, a control off it still forks to its own source.
    const seeded = { ...DEFAULTS, selectionSeed: "#0072f5" }
    expect(resolveDesignSystem(seeded).color?.scopes).toBeUndefined()
    expect(
      resolveDesignSystem({ ...seeded, checkboxColor: "accent" }).color?.scopes,
    ).toEqual({ checkbox: "accent" })
  })

  it("corner rides on the checkbox radius var", () => {
    expect(
      resolveDesignSystem({ ...DEFAULTS, checkCorner: "square" }).tokens,
    ).toEqual({ "--studio-checkbox-radius": "var(--radius-xs)" })
    expect(
      resolveDesignSystem({ ...DEFAULTS, checkCorner: "circle" }).tokens,
    ).toEqual({ "--studio-checkbox-radius": "var(--radius-full)" })
  })

  it("choice cards write the synced card params on all three controls", () => {
    const ds = resolveDesignSystem({
      ...DEFAULTS,
      cardSelected: "outline",
      cardControl: "hidden",
    })
    for (const component of ["checkbox", "radio-group"]) {
      expect(ds.componentParams[component]).toEqual({
        "card-selected": "outline",
        "card-control": "hidden",
      })
    }
    // The switch card always trails its control; only Selected reaches it.
    expect(ds.componentParams.switch).toEqual({ "card-selected": "outline" })
  })
})

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

describe("checkbox and radio motion", () => {
  it("ships shadcn's default timing: no duration or ease class", async () => {
    for (const name of ["checkbox", "radio-group"]) {
      const content = await shipped(name)
      expect(content).toContain("transition-colors has-data-label:w-full")
      expect(content).not.toMatch(/ (duration|ease)-/)
      expect(content).not.toContain("--studio-")
    }
  })

  it("one tweak times checkbox and radio alike", async () => {
    const { tokens } = resolveDesignSystem({
      ...DEFAULTS,
      checkboxMotion: { duration: 200, ease: [0, 0, 0.2, 1] },
    })
    for (const name of ["checkbox", "radio-group"])
      expect(await shipped(name, tokens)).toContain(
        "transition-colors duration-200 ease-out has-data-label:w-full",
      )
  })
})
