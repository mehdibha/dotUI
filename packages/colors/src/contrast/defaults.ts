/**
 * Default values for the contrast algorithm
 */

/**
 * Default contrast ratios for 11-step scale (50-950)
 * These ratios ensure WCAG compliance across the scale
 */
export const DEFAULT_RATIOS = [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15] as const;

/**
 * Default lightness values for modes
 */
export const DEFAULT_LIGHT_LIGHTNESS = 97;
export const DEFAULT_DARK_LIGHTNESS = 5;

/**
 * Default chroma for neutral scale
 * Low chroma creates near-grey colors while maintaining subtle warmth/coolness
 */
export const DEFAULT_NEUTRAL_CHROMA = 10;
