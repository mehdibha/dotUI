/**
 * `DEFAULT_SEMANTICS` — the typed source of truth for dotUI's semantic color
 * vocabulary. Mirrors (and replaces) the hand-authored `@theme` color block in
 * `base/theme.css`; `emitCss(DEFAULT_SEMANTICS)` reproduces it (verified in
 * `emit-css.test.ts`).
 *
 * Order matches `base/theme.css` so regeneration stays diff-clean. Each `on-*`
 * token is contrast-derived (`onOf`) and carries no `scales` pool.
 */

import type { SemanticToken, SemanticVocabulary } from './types'

/** Picker pools: the neutral backbone + any custom palette. */
const NEUTRAL = ['neutral', '..'] as const
/** Picker pool for "primary"-flavored tokens: neutral or the accent brand ramp. */
const PRIMARY = ['neutral', 'accent', '..'] as const

const bg = (ref: string, scales?: readonly string[]): SemanticToken => ({
  target: { ref },
  category: 'background',
  scales,
})
const fg = (ref: string, scales?: readonly string[]): SemanticToken => ({
  target: { ref },
  category: 'foreground',
  scales,
})
const bd = (ref: string, scales?: readonly string[]): SemanticToken => ({
  target: { ref },
  category: 'border',
  scales,
})
/** A contrast-derived foreground: `var(--on-<step>)`. */
const on = (onOf: string): SemanticToken => ({
  target: { onOf },
  category: 'foreground',
})

export const DEFAULT_SEMANTICS = {
  // ---- surfaces / backgrounds ----
  'color-bg': bg('neutral-50', NEUTRAL),
  'color-muted': bg('neutral-200', NEUTRAL),
  'color-inverse': bg('neutral-950', NEUTRAL),
  'color-disabled': bg('neutral-200', NEUTRAL),
  'color-field': bg('neutral-100', NEUTRAL),
  'color-highlight': bg('neutral-300', NEUTRAL),
  'color-fg-on-highlight': on('neutral-300'),
  'color-selected': bg('neutral-300', ['neutral']),
  'color-selected-hover': bg('neutral-400', ['neutral']),
  'color-selected-active': bg('neutral-500', ['neutral']),
  'color-fg-on-selected': on('neutral-300'),
  'color-neutral': bg('neutral-200', ['neutral']),
  'color-neutral-hover': bg('neutral-300', ['neutral']),
  'color-neutral-active': bg('neutral-400', ['neutral']),
  'color-primary': bg('neutral-950', PRIMARY),
  'color-primary-hover': bg('neutral-900', PRIMARY),
  'color-primary-active': bg('neutral-800', PRIMARY),
  'color-primary-muted': bg('neutral-200', PRIMARY),
  'color-success': bg('success-500', ['success']),
  'color-success-hover': bg('success-600', ['success']),
  'color-success-active': bg('success-700', ['success']),
  'color-success-muted': bg('success-100', ['success']),
  'color-success-muted-hover': bg('success-200', ['success']),
  'color-danger': bg('danger-500', ['danger']),
  'color-danger-hover': bg('danger-600', ['danger']),
  'color-danger-active': bg('danger-700', ['danger']),
  'color-danger-muted': bg('danger-100', ['danger']),
  'color-danger-muted-hover': bg('danger-200', ['danger']),
  'color-warning': bg('warning-500', ['warning']),
  'color-warning-hover': bg('warning-600', ['warning']),
  'color-warning-active': bg('warning-700', ['warning']),
  'color-warning-muted': bg('warning-100', ['warning']),
  'color-warning-muted-hover': bg('warning-200', ['warning']),
  'color-info': bg('info-500', ['info']),
  'color-info-hover': bg('info-600', ['info']),
  'color-info-active': bg('info-700', ['info']),
  'color-info-muted': bg('info-50', ['info']),
  'color-accent': bg('accent-500', ['accent']),
  'color-accent-hover': bg('accent-600', ['accent']),
  'color-accent-active': bg('accent-700', ['accent']),
  'color-accent-muted': bg('accent-50', ['accent']),
  'color-accent-muted-hover': bg('accent-100', ['accent']),
  // ---- foregrounds ----
  'color-fg': fg('neutral-950', NEUTRAL),
  // A single neutral step (not a `color-mix`) — the closest match to the prior
  // `mix(neutral-950 60%, neutral-50)` tone (~L 0.47 light / 0.78 dark). Because dark mode
  // reverses the ramp, one step can't hit the exact muted level in both modes; 600 keeps
  // good light-mode contrast at the cost of slightly brighter muted text in dark.
  'color-fg-muted': fg('neutral-600', NEUTRAL),
  'color-fg-inverse': fg('neutral-50', NEUTRAL),
  'color-fg-disabled': fg('neutral-500', NEUTRAL),
  'color-fg-primary-disabled': fg('neutral-300', PRIMARY),
  'color-fg-danger': fg('danger-800', ['danger']),
  'color-fg-warning': fg('warning-800', ['warning']),
  'color-fg-success': fg('success-800', ['success']),
  'color-fg-info': fg('info-800', ['info']),
  'color-fg-accent': fg('accent-800', ['accent']),
  'color-fg-on-neutral': on('neutral-200'),
  'color-fg-on-primary': on('neutral-950'),
  'color-fg-on-accent': on('accent-500'),
  'color-fg-on-success': on('success-500'),
  'color-fg-on-danger': on('danger-500'),
  'color-fg-on-warning': on('warning-500'),
  'color-fg-on-info': on('info-500'),
  // ---- borders ----
  'color-border': bd('neutral-300', NEUTRAL),
  'color-border-hover': bd('neutral-400', NEUTRAL),
  'color-border-active': bd('neutral-500', NEUTRAL),
  'color-border-field': bd('neutral-400', NEUTRAL),
  'color-border-control': bd('neutral-700', NEUTRAL),
  'color-border-disabled': bd('neutral-300', NEUTRAL),
  'color-border-focus': bd('accent-500', PRIMARY),
  'color-border-focus-muted': bd('accent-300', PRIMARY),
  'color-border-success': bd('success-300', ['success']),
  'color-border-success-hover': bd('success-400', ['success']),
  'color-border-accent': bd('accent-300', ['accent']),
  'color-border-accent-hover': bd('accent-400', ['accent']),
  'color-border-danger': bd('danger-300', ['danger']),
  'color-border-danger-hover': bd('danger-400', ['danger']),
  'color-border-warning': bd('warning-300', ['warning']),
  'color-border-warning-hover': bd('warning-400', ['warning']),
  'color-border-info': bd('info-300', ['info']),
  'color-border-info-hover': bd('info-400', ['info']),
  // ---- component surfaces ----
  'color-tooltip': bg('neutral-950', NEUTRAL),
  'color-fg-on-tooltip': on('neutral-950'),
  'color-card': bg('neutral-100', NEUTRAL),
  'color-popover': bg('neutral-100', NEUTRAL),
  'color-sidebar': bg('neutral-100', NEUTRAL),
  'color-border-sidebar': bd('neutral-300', NEUTRAL),
} satisfies SemanticVocabulary
