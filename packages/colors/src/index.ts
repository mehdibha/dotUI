/**
 * @dotui/colors — the color engine.
 *
 * One engine, no algorithm menu (SPEC.md). `createTheme` turns seeds into a
 * complete two-mode system: 12-job scales, solved on-* foregrounds, chart
 * palettes — every guarantee enforced in-loop and audited in
 * the returned report. Pure: no CSS-variable names, no semantic vocabulary
 * (that lives in the www semantic layer).
 */

export { createTheme, type ModeOutput, type Theme } from "./theme"
export type { ThemeOptions } from "./schema"

export { STEPS, type StepName } from "./data"

export { type Mode } from "./scale"

// Color ops for the semantic layer, the builder UI, and the playground.
export {
  fitSrgb,
  lstarOf,
  mixOklab,
  type Oklch,
  oklchCss,
  toHex,
  toOklch,
} from "./space"
export { wcag2 } from "./meters"
