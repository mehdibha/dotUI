'use client'

import { useDesignSystem } from '../preset'

/* ----------------------------------------------------------------------------
 * Foundation tokens not yet owned by a component. These write real CSS vars
 * through the same channel the live axes use — harmless until a component reads
 * one, then instantly live. Names mirror the existing panel schema so nothing
 * has to be renamed when the engine grows a consumer.
 * -------------------------------------------------------------------------- */

export const FONT_HEADING_VAR = '--ds-font-heading'
export const FONT_BODY_VAR = '--ds-font-body'
export const TYPE_SCALE_VAR = '--ds-type-scale'
export const TYPE_BASE_VAR = '--ds-type-base'
export const LETTER_SPACING_VAR = '--ds-letter-spacing'
export const FONT_WEIGHT_VAR = '--ds-font-weight'

export const BORDER_WIDTH_VAR = '--ds-border-width'
export const SPACING_SCALE_VAR = '--ds-spacing-scale'

export const ELEVATION_STYLE_VAR = '--ds-elevation-style'
export const SHADOW_INTENSITY_VAR = '--ds-shadow-intensity'
export const BACKDROP_BLUR_VAR = '--ds-backdrop-blur'

export const MOTION_DURATION_VAR = '--ds-motion-duration'
export const MOTION_EASING_VAR = '--ds-motion-easing'
export const MOTION_ENABLED_VAR = '--ds-motion-enabled'

export const FOCUS_RING_WIDTH_VAR = '--ds-focus-ring-width'

export const ICON_LIBRARY_VAR = '--ds-icon-library'
export const ICON_STROKE_VAR = '--ds-icon-stroke'

/** Read+write one global token with a fallback when it's never been set. */
export function useToken(name: string, fallback: string) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[name] ?? fallback
  const set = (v: string) => setToken(name, v)
  return [value, set] as const
}

/** Same, parsed as a number. */
export function useNumberToken(name: string, fallback: number) {
  const [raw, setRaw] = useToken(name, String(fallback))
  const value = Number.parseFloat(raw)
  return [
    Number.isFinite(value) ? value : fallback,
    (v: number) => setRaw(String(v)),
  ] as const
}
