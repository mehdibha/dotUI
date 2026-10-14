/**
 * `@/registry/theme` — the semantic color layer (token system v2, SPEC.md).
 *
 * Owns the semantic token vocabulary and its CSS emission. The pure engine
 * lives in `@dotui/colors`; this layer maps engine output onto dotUI's
 * `--color-*` tokens and persists the user's `ColorConfig`.
 */

export type {
  JobName,
  ModeName,
  PrimaryColorSource,
  SemanticTarget,
  SemanticToken,
  SemanticVocabulary,
  TokenOverride,
  TokenOverrides,
  TokenTargetSpec,
} from "./types"
export { JOB_STEPS } from "./types"
export {
  applyTokenOverrides,
  scopedSemantics,
  SITE_SEMANTICS,
  semanticDelta,
  semanticsFor,
  semanticVocabulary,
} from "./semantics"
export {
  emitCss,
  type EmitCssOptions,
  emitDarkOverridesCss,
  resolveTargetLiteral,
  semanticLiterals,
} from "./emit-css"
export {
  type ColorConfig,
  DEFAULT_COLOR_CONFIG,
  SITE_COLOR_CONFIG,
} from "./color-config"
export {
  DEFAULT_RADIUS,
  emitPrimitivesCss,
  type EmitPrimitivesOptions,
  type Ramp,
  resolveColorConfig,
  themeOptionsFromConfig,
} from "./primitives"
export { PALETTE_ORDER } from "./palettes"
