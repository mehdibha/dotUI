/**
 * @dotui/colors
 *
 * A unified color palette generator with 100% Leonardo parity.
 *
 * @example
 * import { createTheme } from '@dotui/colors';
 *
 * const theme = createTheme({
 *   colors: [
 *     { name: 'accent', colorKeys: ['#6366f1'], ratios: [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15] },
 *     { name: 'success', colorKeys: ['#22c55e'], ratios: [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15] },
 *   ],
 *   backgroundColor: '#ffffff',
 *   lightness: 97,
 * });
 *
 * // Returns:
 * // {
 * //   background: 'hsl(0, 0%, 96%)',
 * //   colors: {
 * //     accent: { '100': 'hsl(239, 84%, 67%)', ... },
 * //     success: { '100': 'hsl(142, 76%, 36%)', ... },
 * //   }
 * // }
 */

export { createTheme } from "./algorithms/leonardo";

// Re-export Leonardo types
export type {
	CreateThemeInput,
	CreateThemeOutput,
	ColorInput,
	BackgroundColorInput,
} from "./algorithms/leonardo";

// Re-export shared types
export type {
	LeonardoColorspace,
	ContrastFormula,
	MaterialOptions,
	ScaleOutput,
} from "./types";

export { SCALE_STEPS } from "./types";
