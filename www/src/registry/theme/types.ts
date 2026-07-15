/**
 * Semantic color vocabulary types — the typed single source of truth that
 * replaces the hand-authored color block in `base/theme.css`.
 *
 * `emitCss()` renders these to a Tailwind v4 `@theme` block; the customizer reads
 * `category` / `scales` for its pickers. `@dotui/colors` stays the pure kernel
 * (primitive ramp generation); this layer owns the semantic vocabulary + CSS.
 */

/** A named display mode (`"light"`, `"dark"`, or any custom mode). */
export type ModeName = string

/**
 * Which ramp the primary-action tokens (`color-primary*`, `color-fg-on-primary`)
 * draw from: the neutral backbone (black/white buttons — Vercel-style) or the
 * brand accent ramp (colored buttons — Material/Linear-style).
 */
export type PrimaryColorSource = 'neutral' | 'accent'

/** How a semantic token resolves to a CSS value. */
export type SemanticTarget =
  | { ref: string } // → var(--<ref>): a primitive ramp step or another token
  | { onOf: string } // → var(--on-<onOf>): the readable foreground of a ramp step
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
  /** A mode-agnostic target, or a per-mode map (light / dark / arbitrary). */
  target: SemanticTarget | Record<ModeName, SemanticTarget>
  /** Customizer grouping + filter (the one affordance the picker reads today). */
  category: SemanticCategory
  /**
   * Ramp pools the customizer picker may offer for this token; `".."` means
   * "any custom palette". Omitted for contrast-derived `on-*` tokens.
   */
  scales?: readonly string[]
  /** Optional human description for the picker UI. */
  description?: string
}

/** The semantic vocabulary, keyed by token name WITHOUT the leading `--` (e.g. `"color-bg"`). */
export type SemanticVocabulary = Record<string, SemanticToken>
