import type { IconLibraryName } from '@/registry/icons/icon-map'

export const ICON_STROKE_WIDTH_VAR = '--icon-stroke-width'
export const ICON_WEIGHT_VAR = '--icon-weight'

/** Stroke-based libraries the stroke-width axis applies to, with their defaults. */
export const STROKE_DEFAULTS: Partial<Record<IconLibraryName, number>> = {
  lucide: 2,
  tabler: 2,
  hugeicons: 1.5,
}
