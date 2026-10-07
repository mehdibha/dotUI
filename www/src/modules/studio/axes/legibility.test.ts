/* Legibility floors every preset keeps in both modes: the invalid edge reads,
   dark edges stay apart from the surfaces they sit on, selected rows stay
   lighter than selected controls, and a recessed dark shell sinks no deeper
   than its light one. */

import { describe, expect, test } from "vitest"

import { mixOklab, toOklch, wcag2 } from "@dotui/colors"

import { publishables } from "@/registry/__generated__/publishables"
import {
  DEFAULT_COLOR_CONFIG,
  resolveColorConfig,
  semanticLiterals,
  semanticsFor,
} from "@/registry/theme"
import { PRESETS } from "@/modules/presets"

import { designSystemOf } from "../resolve"
import { RECESSED_DARK_PAGE } from "./surfaces"

const literals = PRESETS.map((preset) => {
  const color = designSystemOf(preset.state).color ?? DEFAULT_COLOR_CONFIG
  const theme = resolveColorConfig(color)
  return {
    id: preset.id,
    theme,
    ...semanticLiterals(semanticsFor(color), theme),
  }
})

const L = (color: string) => toOklch(color).l
const ratio = (a: string, b: string) => wcag2(toOklch(a), toOklch(b))

test.each(["input", "checkbox", "radio-group", "switch", "questionnaire"])(
  "%s draws its invalid edge in the danger text ink",
  async (name) => {
    const { stylesConfig } = (await publishables[name]!()).publishable
    const classes = JSON.stringify(stylesConfig)
    expect(classes).toMatch(/invalid:border-fg-danger/)
    expect(classes).not.toMatch(/invalid:[\w:-]*border-border-danger/)
  },
)

describe.each(literals)("$id", ({ light, dark, theme }) => {
  test.each([
    ["light", light],
    ["dark", dark],
  ] as const)("the invalid edge reads at 3:1 in %s", (_, mode) => {
    const edge = mode["color-fg-danger"]!
    for (const ground of ["color-bg", "color-field", "color-popover"])
      expect(ratio(edge, mode[ground]!), ground).toBeGreaterThanOrEqual(3)
  })

  test("dark edges sit as far from their surface as light ones", () => {
    const lightGap = L(light["color-bg"]!) - L(light["color-border"]!)
    const fieldGap = L(light["color-field"]!) - L(light["color-border"]!)
    const border = L(dark["color-border"]!)
    expect(border - L(dark["color-popover"]!)).toBeGreaterThanOrEqual(
      lightGap * 0.9,
    )
    expect(border - L(dark["color-field"]!)).toBeGreaterThanOrEqual(fieldGap)
  })

  test("a selected row is lighter than a selected control", () => {
    expect(L(light["color-selected-row"]!)).toBeGreaterThan(
      L(light["color-selected"]!),
    )
    expect(L(dark["color-selected-row"]!)).toBeLessThan(
      L(dark["color-selected"]!),
    )
  })

  test("a recessed dark shell sinks no deeper than the light one", () => {
    const n = (mode: "light" | "dark", step: "25" | "50" | "100") =>
      toOklch(theme[mode].scales.neutral![step])
    const lightFrame = mixOklab(n("light", "50"), 50, n("light", "100"))
    const darkFrame = mixOklab(
      n("dark", "25"),
      RECESSED_DARK_PAGE,
      toOklch("oklch(0 0 0)"),
    )
    expect(n("dark", "25").l - darkFrame.l).toBeLessThanOrEqual(
      n("light", "25").l - lightFrame.l + 0.001,
    )
  })
})
