/**
 * The semantic vocabulary (token system v2) — the typed single source of
 * truth for dotUI's `--color-*` tokens, generated into CSS by `emitCss`.
 *
 * Tokens map roles onto the engine's 12-job ladder:
 * 25 app-bg · 50 subtle-bg · 100/200/300 ui rest/hover/active ·
 * 400/500/600 borders subtle/interactive/emphasized · 700/800 solid/hover ·
 * 900/950 text low/high-contrast. `on-*` are the engine's solved solid
 * labels; text on light-tint surfaces uses the text jobs (correct in both
 * modes by construction — no more reversed-ramp casualties).
 */

import type {
  PrimaryColorSource,
  SemanticTarget,
  SemanticToken,
  SemanticVocabulary,
} from './types'

/** Picker pools: the neutral backbone + any custom palette. */
const NEUTRAL = ['neutral', '..'] as const
/** Picker pool for "primary"-flavored tokens: neutral or the brand accent ramp. */
const PRIMARY = ['neutral', 'accent', '..'] as const

const ref = (palette: string, step: string): SemanticTarget =>
  ({ ref: { palette, step } }) as SemanticTarget
const on = (palette: string, step: '700' | '800'): SemanticTarget => ({
  on: { palette, step },
})
const mix = (
  a: SemanticTarget,
  weight: number,
  b: SemanticTarget,
): SemanticTarget => ({ mix: { space: 'oklab', stops: [a, weight, b] } })

const bg = (target: SemanticToken['target'], scales?: readonly string[]): SemanticToken => ({
  target,
  category: 'background',
  scales,
})
const fg = (target: SemanticToken['target'], scales?: readonly string[]): SemanticToken => ({
  target,
  category: 'foreground',
  scales,
})
const bd = (target: SemanticToken['target'], scales?: readonly string[]): SemanticToken => ({
  target,
  category: 'border',
  scales,
})

/** The solid + tinted cluster every status hue shares. */
function statusCluster(palette: string): SemanticVocabulary {
  return {
    [`color-${palette}`]: bg(ref(palette, '700'), [palette]),
    [`color-${palette}-hover`]: bg(ref(palette, '800'), [palette]),
    [`color-${palette}-active`]: bg(
      mix(ref(palette, '800'), 88, ref('neutral', '950')),
      [palette],
    ),
    [`color-${palette}-muted`]: bg(ref(palette, '100'), [palette]),
    [`color-${palette}-muted-hover`]: bg(ref(palette, '200'), [palette]),
    [`color-fg-${palette}`]: fg(ref(palette, '900'), [palette]),
    [`color-fg-on-${palette}`]: { target: on(palette, '700'), category: 'foreground' },
    [`color-border-${palette}`]: bd(ref(palette, '400'), [palette]),
    [`color-border-${palette}-hover`]: bd(ref(palette, '500'), [palette]),
  }
}

/**
 * Build the vocabulary for a primary source. `neutral` (default) renders
 * black/white primary actions from the text end of the neutral ladder;
 * `accent` renders brand-colored solids. One table, no emitter special-cases.
 */
export function semanticVocabulary(
  primary: PrimaryColorSource = 'neutral',
): SemanticVocabulary {
  const primaryCluster: SemanticVocabulary =
    primary === 'accent'
      ? {
          'color-primary': bg(ref('accent', '700'), PRIMARY),
          'color-primary-hover': bg(ref('accent', '800'), PRIMARY),
          'color-primary-active': bg(
            mix(ref('accent', '800'), 88, ref('neutral', '950')),
            PRIMARY,
          ),
          'color-primary-muted': bg(ref('accent', '100'), PRIMARY),
          'color-fg-on-primary': {
            target: on('accent', '700'),
            category: 'foreground',
          },
          'color-fg-primary-disabled': fg(ref('accent', '400'), PRIMARY),
        }
      : {
          // The inverse surface: high-contrast text step as a background.
          'color-primary': bg(ref('neutral', '950'), PRIMARY),
          'color-primary-hover': bg(
            mix(ref('neutral', '950'), 90, ref('neutral', '25')),
            PRIMARY,
          ),
          'color-primary-active': bg(
            mix(ref('neutral', '950'), 80, ref('neutral', '25')),
            PRIMARY,
          ),
          'color-primary-muted': bg(ref('neutral', '200'), PRIMARY),
          // Text on the inverse surface is the app background by construction.
          'color-fg-on-primary': {
            target: ref('neutral', '25'),
            category: 'foreground',
          },
          'color-fg-primary-disabled': fg(ref('neutral', '500'), PRIMARY),
        }

  return {
    // ---- surfaces / backgrounds ----
    'color-bg': bg(ref('neutral', '25'), NEUTRAL),
    'color-muted': bg(ref('neutral', '100'), NEUTRAL),
    'color-inverse': bg(ref('neutral', '950'), NEUTRAL),
    'color-disabled': bg(ref('neutral', '100'), NEUTRAL),
    'color-field': bg(ref('neutral', '100'), NEUTRAL),
    'color-highlight': bg(ref('neutral', '200'), NEUTRAL),
    'color-fg-on-highlight': fg(ref('neutral', '950')),
    'color-selected': bg(ref('neutral', '300'), ['neutral']),
    'color-selected-hover': bg(ref('neutral', '400'), ['neutral']),
    'color-selected-active': bg(ref('neutral', '500'), ['neutral']),
    'color-fg-on-selected': fg(ref('neutral', '950')),
    'color-neutral': bg(ref('neutral', '100'), ['neutral']),
    'color-neutral-hover': bg(ref('neutral', '200'), ['neutral']),
    'color-neutral-active': bg(ref('neutral', '300'), ['neutral']),
    ...primaryCluster,
    ...statusCluster('success'),
    ...statusCluster('danger'),
    ...statusCluster('warning'),
    ...statusCluster('info'),
    ...statusCluster('accent'),
    // ---- foregrounds ----
    'color-fg': fg(ref('neutral', '950'), NEUTRAL),
    'color-fg-muted': fg(ref('neutral', '900'), NEUTRAL),
    'color-fg-inverse': fg(ref('neutral', '25'), NEUTRAL),
    'color-fg-disabled': fg(ref('neutral', '600'), NEUTRAL),
    'color-fg-on-neutral': fg(ref('neutral', '950')),
    // ---- borders ----
    'color-border': bd(ref('neutral', '400'), NEUTRAL),
    'color-border-hover': bd(ref('neutral', '500'), NEUTRAL),
    'color-border-active': bd(ref('neutral', '600'), NEUTRAL),
    'color-border-field': bd(ref('neutral', '500'), NEUTRAL),
    'color-border-control': bd(ref('neutral', '600'), NEUTRAL),
    'color-border-disabled': bd(ref('neutral', '400'), NEUTRAL),
    'color-border-focus': bd(ref('accent', '700'), PRIMARY),
    'color-border-focus-muted': bd(ref('accent', '300'), PRIMARY),
    // ---- component surfaces ----
    'color-tooltip': bg(ref('neutral', '950'), NEUTRAL),
    'color-fg-on-tooltip': fg(ref('neutral', '25')),
    'color-card': bg(ref('neutral', '50'), NEUTRAL),
    'color-popover': bg(ref('neutral', '50'), NEUTRAL),
    'color-sidebar': bg(ref('neutral', '50'), NEUTRAL),
    'color-border-sidebar': bd(ref('neutral', '400'), NEUTRAL),
    // ---- overlay / chrome (previously hardcoded in components) ----
    'color-overlay': bg({ value: 'oklch(0 0 0)' }),
    'color-thumb': bg({ value: 'oklch(1 0 0)' }),
  }
}

/** The default vocabulary (neutral primary). */
export const DEFAULT_SEMANTICS = semanticVocabulary('neutral')

/** The vocabulary with the primary cluster drawing from `source`. */
export function semanticsWithPrimary(
  source: PrimaryColorSource | undefined,
): SemanticVocabulary {
  return semanticVocabulary(source ?? 'neutral')
}

/** The primary-cluster overrides alone (accent source) — for scoped re-emits. */
export const ACCENT_PRIMARY_SEMANTICS: SemanticVocabulary = Object.fromEntries(
  Object.entries(semanticVocabulary('accent')).filter(
    ([name]) =>
      name.startsWith('color-primary') ||
      name === 'color-fg-on-primary' ||
      name === 'color-fg-primary-disabled',
  ),
)
