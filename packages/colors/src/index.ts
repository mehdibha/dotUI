/**
 * @dotui/colors — the color engine.
 *
 * One engine, no algorithm menu (SPEC.md). `createTheme` turns seeds into a
 * complete two-mode system: 12-job scales, solved on-* foregrounds, alpha
 * twins, chart palettes — every guarantee enforced in-loop and audited in
 * the returned report. Pure: no CSS-variable names, no semantic vocabulary
 * (that lives in the www semantic layer).
 */

export {
  type ChartSet,
  createTheme,
  type ModeOutput,
  type Theme,
  themeOptionsSchema,
  type ThemeOptions,
  type ThemeReport,
} from './theme'

export { STATUS_SEEDS, STEPS, type StatusName, type StepName } from './data'

export { type GuaranteeResult } from './verify'
export { type BorderTargets, type Mode } from './scale'

// Color ops for the semantic layer, the builder UI, and the playground.
export {
  cusp,
  fitSrgb,
  lstarOf,
  maxChroma,
  type Oklch,
  oklchCss,
  toHex,
  toOklch,
} from './space'
export {
  apca,
  type CvdKind,
  deltaEok,
  minPairwiseDeltaEok,
  simulateCvd,
  wcag2,
} from './meters'
export { alphaTwin, solveAlphaRgb8 } from './alpha'
export {
  categoricalGateReport,
  categoricalPalette,
  divergingPalette,
  sequentialPalette,
  tonalCategoricalPalette,
  tonalGateReport,
} from './charts'
