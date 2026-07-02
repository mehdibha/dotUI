/* ----------------------------------------------------------------------------
 * Studio token vocabulary
 *
 * The CSS custom properties every studio control writes into. Two kinds:
 *   - REAL tokens the preview already consumes (radius factor, cursors) — these
 *     are re-exported from the modules that own them so there is a single source.
 *   - `--ds-*` stub tokens the preview has no consumer for yet. They still write
 *     through the normal token channel, so they are harmless today and become
 *     live the moment a component reads them. Surfaced honestly in the UI via the
 *     `binding` flag — nothing here pretends to be wired that isn't.
 * -------------------------------------------------------------------------- */

export {
  CURSOR_DISABLED_VAR,
  CURSOR_INTERACTIVE_VAR,
  DEFAULT_CURSOR_DISABLED,
  DEFAULT_CURSOR_INTERACTIVE,
} from '../cursor'
export { DEFAULT_RADIUS_FACTOR, RADIUS_FACTOR_VAR } from '../layout'

/* Typography */
export const FONT_HEADING_VAR = '--ds-font-heading'
export const FONT_BODY_VAR = '--ds-font-body'
export const TYPE_SCALE_VAR = '--ds-type-scale'
export const TYPE_BASE_VAR = '--ds-type-base'
export const TRACKING_VAR = '--ds-tracking'
export const HEADING_WEIGHT_VAR = '--ds-heading-weight'
export const LINE_HEIGHT_VAR = '--ds-line-height'

/* Shape */
export const BORDER_WIDTH_VAR = '--ds-border-width'
export const CORNER_STYLE_VAR = '--ds-corner-style' // rounded | squircle

/* Spacing */
export const SPACING_SCALE_VAR = '--ds-spacing-scale'
export const BASE_UNIT_VAR = '--ds-base-unit' // 4 | 8 (pt grid)
export const CONTENT_WIDTH_VAR = '--ds-content-width'

/* Elevation */
export const ELEVATION_STYLE_VAR = '--ds-elevation-style' // flat|soft|depth|glass
export const SHADOW_INTENSITY_VAR = '--ds-shadow-intensity'
export const SHADOW_TINT_VAR = '--ds-shadow-tint' // neutral | brand
export const BACKDROP_BLUR_VAR = '--ds-backdrop-blur'

/* Motion */
export const MOTION_DURATION_VAR = '--ds-motion-duration'
export const MOTION_EASING_VAR = '--ds-motion-easing'
export const MOTION_ENABLED_VAR = '--ds-motion-enabled'
export const HOVER_LIFT_VAR = '--ds-hover-lift'
export const PRESS_SCALE_VAR = '--ds-press-scale'

/* Interaction */
export const FOCUS_RING_WIDTH_VAR = '--ds-focus-ring-width'
export const FOCUS_RING_STYLE_VAR = '--ds-focus-ring-style' // ring|outline|glow

/* Icons */
export const ICON_LIBRARY_VAR = '--ds-icon-library'
export const ICON_STROKE_VAR = '--ds-icon-stroke'
export const ICON_SCALE_VAR = '--ds-icon-scale'

/* Mode & content */
export const DEFAULT_MODE_VAR = '--ds-default-mode'
export const LABEL_CASING_VAR = '--ds-label-casing' // title | sentence
