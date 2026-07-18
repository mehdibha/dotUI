/**
 * Semantic color vocabulary types (token system v2 — see SPEC.md).
 *
 * A token targets the engine's primitives by (palette, step) — steps are the
 * 12-job ladder — or an alpha twin, a solved on-label, a mix, or a literal.
 * Targets are per-mode capable: `.dark` re-points are generated, never
 * hand-authored. `@dotui/colors` stays the pure engine (ramp generation);
 * this layer owns the semantic vocabulary + CSS.
 */

import type { StepName } from '@dotui/colors'

export type ModeName = 'light' | 'dark'

/**
 * Which ramp the primary-action tokens (`color-primary*`, `color-fg-on-primary`)
 * draw from: the neutral backbone (black/white buttons — Vercel-style) or the
 * brand accent ramp (colored buttons — Material/Linear-style).
 */
export type PrimaryColorSource = 'neutral' | 'accent'

/** How a semantic token resolves to a CSS value. */
export type SemanticTarget =
  | { ref: { palette: string; step: StepName } } // → var(--<palette>-<step>)
  | { alpha: { palette: string; step: StepName } } // → var(--<palette>-a<step>)
  | { on: { palette: string; step: '700' | '800' } } // → var(--on-<palette>-<step>)
  | { value: string } // a literal CSS value
  | {
      mix: {
        space: 'oklab' | 'oklch' | 'srgb'
        stops: [SemanticTarget, number, SemanticTarget]
      }
    }

/** Customizer grouping for a token. The picker filters on this today. */
export type SemanticCategory = 'background' | 'foreground' | 'border'

export interface SemanticToken {
  /** A mode-agnostic target, or a per-mode pair (dark re-points are generated). */
  target: SemanticTarget | { light: SemanticTarget; dark: SemanticTarget }
  /** Customizer grouping + filter. */
  category: SemanticCategory
  /**
   * Ramp pools the customizer picker may offer for this token; `".."` means
   * "any custom palette". Omitted for solved `on-*` tokens.
   */
  scales?: readonly string[]
  /** Optional human description for the picker UI. */
  description?: string
}

/** The semantic vocabulary, keyed by token name WITHOUT the leading `--` (e.g. `"color-bg"`). */
export type SemanticVocabulary = Record<string, SemanticToken>
