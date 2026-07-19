/**
 * `@/registry/theme` — the semantic color layer (token system v2, SPEC.md).
 *
 * Owns the semantic token vocabulary and its CSS emission. The pure engine
 * lives in `@dotui/colors`; this layer maps engine output onto dotUI's
 * `--color-*` tokens and persists the user's `ColorConfig`.
 */

export type {
  ModeName,
  PrimaryColorSource,
  SemanticCategory,
  SemanticTarget,
  SemanticToken,
  SemanticVocabulary,
} from './types'
export {
  ACCENT_PRIMARY_SEMANTICS,
  DEFAULT_SEMANTICS,
  semanticsWithPrimary,
  semanticVocabulary,
} from './semantics'
export { colorTokenNames } from './params'
export {
  emitCss,
  type EmitCssOptions,
  emitDarkOverridesCss,
  resolveTarget,
  resolveTokenValue,
} from './emit-css'
export {
  type ColorConfig,
  colorConfigSchema,
  DEFAULT_COLOR_CONFIG,
  DEFAULT_STATUS_SEEDS,
  migrateColorConfig,
  type PaletteSeeds,
} from './color-config'
export {
  emitPrimitivesCss,
  type EmitPrimitivesOptions,
  type Ramp,
  resolveColorConfig,
  themeOptionsFromConfig,
} from './primitives'
export { PALETTE_ORDER, type PaletteName, STATUS_PALETTES } from './palettes'
