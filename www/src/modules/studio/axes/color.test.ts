import { describe, expect, it, test } from "vitest"

import { toOklch, wcag2 } from "@dotui/colors"

import { publishables } from "@/registry/__generated__/publishables"
import { DEFAULT_COLOR_CONFIG, resolveColorConfig } from "@/registry/theme"
import { publish, selectPublishable } from "@/publisher/publish"
import { PRESETS } from "@/modules/presets"

import {
  DEFAULT_EFFECTIVE,
  DEFAULT_STATE,
  DEFAULTS,
  effective,
  parseState,
} from "."
import { designSystemOf } from "../resolve"
import { buildColorConfig, SOLID_LEAVES, withSource } from "./color"

const tokensOf = (state: Partial<typeof DEFAULTS>) =>
  designSystemOf(parseState(state)).tokens

describe("color axis", () => {
  it("the defaults are the shipped palette, resolved explicitly", () => {
    expect(buildColorConfig(DEFAULT_EFFECTIVE)).toEqual(DEFAULT_COLOR_CONFIG)
    expect(designSystemOf(DEFAULT_STATE).color).toEqual(DEFAULT_COLOR_CONFIG)
  })

  it("maps seeds and engine axes onto ColorConfig, absent when default", () => {
    const { color } = designSystemOf(
      parseState({
        brand: "#5e6ad2",
        ...withSource(SOLID_LEAVES, "accent"),
        successSeed: "#16a34a",
        selectionSeed: "#0072f5",
        neutralHue: 250,
        neutralTint: 2,
        vividness: 1.3,
        preserveSeed: true,
      }),
    )
    expect(color).toEqual({
      v: 2,
      seeds: { accent: "#5e6ad2", success: "#16a34a", selection: "#0072f5" },
      background: { dark: 2 },
      vividness: 1.3,
      neutralTint: 2,
      neutralHue: 250,
      preserveSeed: true,
      primary: "accent",
      // The slider keeps its own source off the selection seed.
      scopes: { slider: "accent" },
    })
  })

  it("stores the selection source only when it leaves the primary's", () => {
    const source = (state: Partial<typeof DEFAULTS>) =>
      buildColorConfig(effective(parseState({ ...state })).values).selection
    expect(source({ selectionColor: "accent" })).toBeUndefined()
    expect(source({ selectionColor: "neutral" })).toBe("neutral")
    expect(source(withSource(SOLID_LEAVES, "neutral"))).toBeUndefined()
    expect(source({ buttonColor: "neutral", selectionColor: "accent" })).toBe(
      "accent",
    )
  })

  it("maps the backgrounds onto per-polarity backgrounds (0 dark = OLED)", () => {
    expect(
      designSystemOf(parseState({ lightBg: 97, darkBg: 0 })).color?.background,
    ).toEqual({ light: 97, dark: "oled" })
  })

  it("White ink reaches the engine only on a kept-exact brand", () => {
    const owl = { brand: "#58cc02", solidInk: "white" }
    const white = (state: Partial<typeof DEFAULTS>) => {
      const theme = resolveColorConfig(designSystemOf(parseState(state)).color!)
      return toOklch(theme.light.on.accent!["700"]).l > 0.999
    }
    expect(designSystemOf(parseState(owl)).color?.solidInk).toBeUndefined()
    expect(white(owl)).toBe(false)
    expect(
      designSystemOf(parseState({ ...owl, preserveSeed: true })).color
        ?.solidInk,
    ).toBe("white")
    expect(white({ ...owl, preserveSeed: true })).toBe(true)
    expect(white({ ...owl, preserveSeed: true, solidInk: "auto" })).toBe(false)
  })

  it("keeps a neutral primary off the accent default", () => {
    const { color } = designSystemOf(
      parseState(withSource(SOLID_LEAVES, "neutral")),
    )
    expect(color).toBeDefined()
    expect(color?.primary).toBeUndefined()
  })
})

describe("control edge", () => {
  it("Firm is Origin's edge and emits nothing", () => {
    expect(DEFAULT_EFFECTIVE.controlEdge).toBe("firm")
    expect(Object.keys(tokensOf({}))).not.toContain("--color-border-control")
  })

  it("re-points the control edge pair", () => {
    expect(tokensOf({ controlEdge: "soft" })).toMatchObject({
      "--color-border-control": "var(--color-border)",
      "--color-border-control-hover": "var(--neutral-400)",
    })
    expect(tokensOf({ controlEdge: "strong" })).toMatchObject({
      "--color-border-control": "var(--neutral-700)",
      "--color-border-control-hover": "var(--neutral-800)",
    })
  })

  it("Strong clears 3:1 against the page in every preset and mode", () => {
    for (const preset of PRESETS) {
      const theme = resolveColorConfig(
        buildColorConfig(effective(preset.state).values),
      )
      for (const mode of ["light", "dark"] as const) {
        const m = theme[mode]
        const edge = toOklch(m.scales.neutral!["700"])
        const page = toOklch(m.scales.neutral!["25"])
        expect(wcag2(edge, page), `${preset.id} ${mode}`).toBeGreaterThan(3)
      }
    }
  })
})

describe("selected wash", () => {
  it("Neutral is the default and keeps the registry's neutral cluster", () => {
    expect(DEFAULTS.selectedWash).toBe("neutral")
    expect(Object.keys(tokensOf({}))).not.toContain("--color-selected")
  })

  it("Brand re-points the cluster onto the accent ramp", () => {
    expect(tokensOf({ selectedWash: "brand" })).toMatchObject({
      "--color-selected": "var(--accent-100)",
      "--color-selected-hover": "var(--accent-200)",
      "--color-selected-active": "var(--accent-300)",
      "--color-fg-on-selected": "var(--color-fg-accent)",
    })
  })
})

test.each(["table", "tree", "tag-group", "token-field"])(
  "%s paints selected items with the wash, never the accent tint",
  async (name) => {
    const ds = designSystemOf(DEFAULT_STATE)
    const preset = { ...ds, componentParams: ds.componentParams }
    const { item } = publish({
      publishable: selectPublishable(await publishables[name]!(), preset),
      preset,
    })
    const code = (item.files ?? []).map((f) => f.content).join("\n")
    expect(code).toMatch(/\bbg-selected\b/)
    expect(code).not.toMatch(
      /(selected|drop-target|dragging):(bg-accent-muted|text-fg-accent|border-border-accent)/,
    )
  },
)
