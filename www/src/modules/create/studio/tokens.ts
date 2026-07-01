/**
 * CSS variables the builder writes for axes the live preview doesn't consume
 * *yet*. They flow through the same `tokens` channel as the wired ones, so each
 * is harmless today and becomes live the instant a component reads it — the
 * project's stated philosophy: new axes are switchable at runtime, never baked.
 *
 * The wired vars (radius factor, cursor, chart, color recipe, density) live in
 * their own modules; these are only the not-yet-consumed ones.
 */
export const FONT_HEADING_VAR = '--ds-font-heading'
export const FONT_BODY_VAR = '--ds-font-body'
export const TYPE_SCALE_VAR = '--ds-type-scale'
export const TYPE_BASE_VAR = '--ds-type-base'
export const LETTER_SPACING_VAR = '--ds-letter-spacing'

export const BORDER_WIDTH_VAR = '--ds-border-width'
export const SPACING_SCALE_VAR = '--ds-spacing-scale'

export const PALETTES_FOUNDATION_VAR = '--ds-palettes-foundations'

export const STYLE_FAMILY_VAR = '--ds-style-family'
export const SHADOW_INTENSITY_VAR = '--ds-shadow-intensity'
export const BACKDROP_BLUR_VAR = '--ds-backdrop-blur'
export const TRANSLUCENT_VAR = '--ds-translucent-overlays'

export const MOTION_DURATION_VAR = '--ds-motion-duration'
export const MOTION_ENABLED_VAR = '--ds-motion-enabled'
export const REDUCED_MOTION_VAR = '--ds-reduced-motion'

export const ICON_LIBRARY_VAR = '--ds-icon-library'
export const ICON_STROKE_VAR = '--ds-icon-stroke'

export const FOCUS_RING_WIDTH_VAR = '--ds-focus-ring-width'
export const DEFAULT_MODE_VAR = '--ds-default-mode'
