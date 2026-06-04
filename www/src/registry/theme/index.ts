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
