/**
 * `@/registry/theme` — the semantic color layer.
 *
 * Owns the semantic token vocabulary (`DEFAULT_SEMANTICS`) and its CSS emission
 * (`emitCss`). The pure ramp kernel lives in `@dotui/colors`; this layer maps a
 * generated (or fixed) set of primitive ramps onto dotUI's `--color-*` tokens.
 */

export type { ModeName, SemanticCategory, SemanticTarget, SemanticToken, SemanticVocabulary } from "./types";
export { DEFAULT_SEMANTICS } from "./semantics";
export { colorTokenNames } from "./params";
export { emitCss, type EmitCssOptions, resolveTarget } from "./emit-css";
export {
	type AlgorithmId,
	type ColorConfig,
	type ColorKnobs,
	DEFAULT_COLOR_CONFIG,
	GENERATIVE_ALGORITHMS,
	type PaletteSeeds,
} from "./color-config";
export { emitPrimitivesCss, type Ramp, resolveColorConfig, type ResolvedPalettes } from "./primitives";
export {
	ACCENT_KERNEL_NAME,
	fromKernelPaletteName,
	PALETTE_ORDER,
	type PaletteName,
	STATUS_PALETTES,
	toKernelPaletteName,
} from "./palettes";
