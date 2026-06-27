'use client'

import { useDesignSystem } from '../preset'

/* ----------------------------------------------------------------------------
 * Token vocabulary for the builder.
 *
 * Real tokens (radius factor, cursors) already drive the preview. The `--ds-*`
 * names below have no consumer yet — they're the axes we'd PROPOSE. Writing them
 * through `setToken` is harmless (they ride in the encoded preset) and becomes
 * instantly live the day a component reads one, so the UI is honest, not faked
 * — every control built on a `--ds-*` var wears a hollow `BindingDot`.
 * -------------------------------------------------------------------------- */

// Live — these CSS vars are consumed by the live preview today.
export { RADIUS_FACTOR_VAR, DEFAULT_RADIUS_FACTOR } from '../layout'
export {
  CURSOR_INTERACTIVE_VAR,
  CURSOR_DISABLED_VAR,
  DEFAULT_CURSOR_INTERACTIVE,
  DEFAULT_CURSOR_DISABLED,
} from '../cursor'

// Stub — proposed axes, no consumer yet.
export const FONT_HEADING_VAR = '--ds-font-heading'
export const FONT_BODY_VAR = '--ds-font-body'
export const TYPE_SCALE_VAR = '--ds-type-scale'
export const TYPE_BASE_VAR = '--ds-type-base'
export const ICON_LIBRARY_VAR = '--ds-icon-library'
export const ICON_STROKE_VAR = '--ds-icon-stroke'
export const BORDER_WIDTH_VAR = '--ds-border-width'
export const ELEVATION_STYLE_VAR = '--ds-elevation-style'
export const SHADOW_INTENSITY_VAR = '--ds-shadow-intensity'
export const BACKDROP_BLUR_VAR = '--ds-backdrop-blur'
export const TRANSLUCENT_VAR = '--ds-translucent-surfaces'
export const MOTION_DURATION_VAR = '--ds-motion-duration'
export const MOTION_ENABLED_VAR = '--ds-motion-enabled'
export const REDUCED_MOTION_VAR = '--ds-reduced-motion'
export const FOCUS_RING_WIDTH_VAR = '--ds-focus-ring-width'
export const DEFAULT_MODE_VAR = '--ds-default-mode'
export const EXPOSE_PALETTES_VAR = '--ds-expose-palettes'
export const CONTEXT_TOKENS_VAR = '--ds-context-tokens'

/** Read + write one token of the design system, with a typed fallback. */
export function useToken(name: string, fallback: string) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[name] ?? fallback
  const set = (v: string) => setToken(name, v)
  /** Whether this token has been touched (vs. still its auto/derived default). */
  const touched = name in designSystem.tokens
  return [value, set, touched] as const
}
