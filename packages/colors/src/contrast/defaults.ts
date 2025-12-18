/**
 * Default values for the contrast algorithm
 */

/**
 * Default contrast ratios for 11-step scale (50-950)
 * These ratios ensure WCAG compliance across the scale
 */
export const DEFAULT_RATIOS = [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15] as const;

/**
 * Default hues for semantic colors (in degrees, HCT/OKLCH)
 * Used when user doesn't provide explicit colors
 */
export const DEFAULT_SEMANTIC_HUES = {
	success: 142, // Green
	warning: 45, // Amber
	danger: 25, // Red
} as const;

/**
 * Default chroma for neutral scale
 * Low chroma creates near-grey colors while maintaining subtle warmth/coolness
 */
export const DEFAULT_NEUTRAL_CHROMA = 10;
