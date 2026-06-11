/**
 * @dotui/colors — the color kernel.
 *
 * Generates primitive ramps (+ paired on-* foregrounds) from seeds via pluggable
 * producers, and verifies contrast on resolved pairings. Pure: no CSS, no DOM, no
 * semantic-token vocabulary (that lives in the semantic layer).
 */

// Generation
export { createTheme } from './theme'
export { type CreateThemeOptions, createThemeOptionsSchema } from './schema'

// Verification
export {
  nudgeForTarget,
  pairingsFromTheme,
  verify,
  verifyTheme,
  type PairingResult,
  type SemanticPairing,
  type SizeClass,
  type VerifyReport,
} from './verify'

// Registry (for presets / advanced consumers)
export {
  type AlgorithmId,
  type BuiltinAlgorithmId,
  type ColorProducer,
  getProducer,
  hasProducer,
  type ModeCtx,
  type PaletteOutput,
  registerProducer,
} from './producer'
export { registerBuiltins } from './producers'

// Shared kernel ops + types
export {
  apca,
  type ContrastFormula,
  gamutMap,
  type Oklch,
  oklchCss,
  toOklch,
  wcag2,
} from './shared/color'
export { onBlackWhite, onColor } from './shared/on-color'
export { SEMANTIC_COLORS } from './shared/constants'
export type { ColorScale, Theme, ThemeMode } from './shared/types'
