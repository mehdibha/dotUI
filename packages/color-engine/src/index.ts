/**
 * @dotui/color-engine
 *
 * A unified color palette generator supporting multiple algorithms:
 * - Leonardo: Adobe's contrast-based color generation (WCAG compliant)
 * - Material: Google's HCT perceptual color system
 * - Radix: Radix UI's hand-tuned scale blending
 *
 * @example
 * // Unified API (loads all algorithms)
 * import { generateScale } from '@dotui/color-engine';
 *
 * const scale = generateScale({
 *   algorithm: 'leonardo',
 *   color: '#6366f1',
 *   background: '#ffffff',
 * });
 *
 * @example
 * // Tree-shakeable direct imports
 * import { generateScale } from '@dotui/color-engine/leonardo';
 *
 * const scale = generateScale({
 *   color: '#6366f1',
 *   background: '#ffffff',
 * });
 */

// ============================================================================
// Types
// ============================================================================

export type {
  // Core types
  RGB,
  HSL,
  OKLCH,
  ScaleOutput,
  ScaleStep,
  Algorithm,
  // Algorithm-specific input types
  LeonardoOptions,
  LeonardoColorspace,
  ContrastFormula,
  MaterialOptions,
  RadixOptions,
  RadixScaleName,
  // Unified input type
  GenerateScaleInput,
  LeonardoInput,
  MaterialInput,
  RadixInput,
} from "./core/types";

export { SCALE_STEPS } from "./core/types";

// ============================================================================
// Algorithm Imports
// ============================================================================

import { generateScale as generateLeonardoScale } from "./algorithms/leonardo";
import { generateScale as generateMaterialScale } from "./algorithms/material";
import { generateScale as generateRadixScale } from "./algorithms/radix";

import type { GenerateScaleInput, ScaleOutput } from "./core/types";

// ============================================================================
// Unified API
// ============================================================================

/**
 * Generate a color scale using the specified algorithm
 *
 * @param input - Configuration including algorithm selection and options
 * @returns ScaleOutput with 11 steps (50, 100, 200, ..., 900, 950)
 *
 * @example
 * // Leonardo (contrast-based)
 * const scale = generateScale({
 *   algorithm: 'leonardo',
 *   color: '#6366f1',
 *   background: '#ffffff',
 *   ratios: [1.05, 1.15, 1.3, 1.5, 2, 3, 4.5, 6, 8, 12, 15],
 * });
 *
 * @example
 * // Material HCT (perceptual)
 * const scale = generateScale({
 *   algorithm: 'material',
 *   color: '#6366f1',
 *   tones: [99, 95, 90, 80, 70, 60, 50, 40, 30, 20, 10],
 * });
 *
 * @example
 * // Radix (hand-tuned blending)
 * const scale = generateScale({
 *   algorithm: 'radix',
 *   accent: '#6366f1',
 *   background: '#ffffff',
 * });
 */
export function generateScale(input: GenerateScaleInput): ScaleOutput {
  switch (input.algorithm) {
    case "leonardo": {
      const { algorithm: _, ...options } = input;
      return generateLeonardoScale(options);
    }
    case "material": {
      const { algorithm: _, ...options } = input;
      return generateMaterialScale(options);
    }
    case "radix": {
      const { algorithm: _, ...options } = input;
      return generateRadixScale(options);
    }
    default: {
      // TypeScript exhaustiveness check
      const _exhaustive: never = input;
      throw new Error(`Unknown algorithm: ${(_exhaustive as GenerateScaleInput).algorithm}`);
    }
  }
}

// ============================================================================
// Named Algorithm Exports (for direct use)
// ============================================================================

export {
  generateLeonardoScale,
  generateMaterialScale,
  generateRadixScale,
};

// ============================================================================
// Utility Re-exports
// ============================================================================

export {
  // Color conversions
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToOklch,
  oklchToRgb,
  // Contrast calculations
  luminance,
  contrastRatio,
  contrastWithDirection,
  apcaContrast,
  // Utilities
  clamp,
  round,
  lerp,
  interpolateRgb,
  interpolateOklch,
  isValidHex,
  getContrastTextColor,
} from "./core/utils";

// ============================================================================
// Algorithm-specific Utilities
// ============================================================================

export {
  getHct,
  fromHct,
  getContrastTones,
} from "./algorithms/material";

export {
  getRadixScale,
  getRadixScaleNames,
} from "./algorithms/radix";
