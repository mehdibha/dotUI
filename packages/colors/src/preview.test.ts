/**
 * The previews are createTheme's own solve for one role: they must agree
 * with a full run exactly, or a picker would show what never ships.
 */

import { describe, expect, test } from "vitest"

import { createTheme, previewScale, previewSolid } from "./index"

const SEEDS = [
  "#46a758", // in the solid window, white label
  "#ffe629", // bright, dark label
  "#34c759", // label dead zone: pinned darker
  "#0b0b0b", // below the window: clamped, rides the neutral model
  "oklch(0.97 0.05 95)", // above the window: clamped
  "#777777", // achromatic
]

const OPTIONS = [
  {},
  { vividness: 1.5, background: { dark: 2 } },
  { vividness: 0.5, hueShift: 2, background: { light: 94, dark: "oled" } },
] as const

describe("previews", () => {
  for (const options of OPTIONS) {
    test(`match createTheme ${JSON.stringify(options)}`, () => {
      for (const seed of SEEDS) {
        const theme = createTheme({
          seeds: { accent: "#438cd6", success: seed },
          ...options,
        })
        expect(previewSolid(seed, options)).toEqual({
          solid: theme.light.scales.success!["700"],
          on: theme.light.on.success!["700"],
        })
        for (const mode of ["light", "dark"] as const) {
          expect(previewScale(seed, mode, options)).toEqual({
            steps: theme[mode].scales.success,
            on: theme[mode].on.success!["700"],
          })
        }
      }
    })
  }
})
