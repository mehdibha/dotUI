/**
 * @dotui/colors
 *
 * Color theme generator with sensible defaults.
 *
 * @example
 * import { createTheme } from '@dotui/colors';
 *
 * // Minimal usage - just accent and background
 * const theme = createTheme({
 *   accent: '#6366f1',
 *   background: '#ffffff',
 * });
 *
 * // Full control
 * const theme = createTheme({
 *   neutral: '#64748b',
 *   accent: '#6366f1',
 *   success: '#22c55e',
 *   warning: '#f59e0b',
 *   danger: '#ef4444',
 *   background: '#ffffff',
 *   algorithm: 'contrast',
 * });
 *
 * // Returns:
 * // {
 * //   background: 'hsl(0, 0%, 100%)',
 * //   scales: {
 * //     neutral: { '50': 'hsl(...)', '100': 'hsl(...)', ... '950': 'hsl(...)' },
 * //     accent:  { '50': 'hsl(...)', ... },
 * //     success: { '50': 'hsl(...)', ... },
 * //     warning: { '50': 'hsl(...)', ... },
 * //     danger:  { '50': 'hsl(...)', ... },
 * //   }
 * // }
 */

// Main API
export { createTheme } from "./create-theme";
// Re-export SCALE_STEPS for advanced use
export { SCALE_STEPS } from "./types";
// Type exports
export type { ColorScale, CreateThemeOptions, Theme } from "./types";
