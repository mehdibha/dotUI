/**
 * Palette identity — the single source for which palettes exist and in what
 * order. Imported by the resolver, the codec, and the customizer so none of
 * them re-declare the list. (The engine names the brand palette `accent`
 * natively — the v1 `primary` rename seam is gone.)
 */

/** Emission + display order for every palette dotUI generates. */
export const PALETTE_ORDER = [
  'neutral',
  'accent',
  'success',
  'warning',
  'danger',
  'info',
] as const

/** The optional status palettes (everything but the neutral backbone + brand accent). */
export const STATUS_PALETTES = ['success', 'warning', 'danger', 'info'] as const

export type PaletteName = (typeof PALETTE_ORDER)[number]
