/**
 * Default values for the Material HCT algorithm
 */

/**
 * Default tones for 11-step scale (50-950)
 * Higher tone = lighter color (0=black, 100=white)
 * Maps to scale steps: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
 */
export const DEFAULT_TONES = [99, 95, 90, 80, 70, 60, 50, 40, 30, 20, 10] as const;

/**
 * Default hues for semantic colors (in degrees, HCT)
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
export const DEFAULT_NEUTRAL_CHROMA = 8;
