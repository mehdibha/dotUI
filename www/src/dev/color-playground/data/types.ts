/**
 * Reference palette data for the color-system v2 playground.
 *
 * Values must come from publicly documented sources (the `url` field) — never
 * approximated or invented. A source with no documented dark ramps ships an
 * empty `dark` array and says so in `notes`.
 */

export interface ReferenceScale {
  /** Scale name as the source calls it, e.g. `blue`, `gray`. */
  name: string
  /** Ordered step label → CSS color, in the source's own step naming. */
  steps: Record<string, string>
}

export interface ReferenceSource {
  id: 'tailwind' | 'radix' | 'geist' | 'spectrum' | 'primer'
  label: string
  /** Where the values were taken from. */
  url: string
  /** Ordered step labels shared by every scale in this source. */
  stepLabels: string[]
  light: ReferenceScale[]
  dark: ReferenceScale[]
  notes?: string
}
