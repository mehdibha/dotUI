/**
 * Material HCT Algorithm Wrapper
 *
 * Wraps @material/material-color-utilities to generate
 * perceptually uniform color scales using HCT color space.
 *
 * HCT = Hue, Chroma, Tone (Google's perceptual color system)
 */

import {
  Hct,
  TonalPalette,
} from "@material/material-color-utilities";
import Color from "colorjs.io";

import type { MaterialOptions, ScaleOutput } from "../../types";
import { SCALE_STEPS } from "../../types";

// ============================================================================
// Default Values
// ============================================================================

/**
 * Default tones for 11-step scale
 * Maps to 50-950 naming convention
 * Higher tone = lighter color
 */
const DEFAULT_TONES = [99, 95, 90, 80, 70, 60, 50, 40, 30, 20, 10];

// ============================================================================
// Color Conversion Utilities
// ============================================================================

/**
 * Convert hex to ARGB integer (Material format)
 */
function hexToArgb(hex: string): number {
  const color = new Color(hex).to("srgb");
  const r = Math.round((color.coords[0] ?? 0) * 255);
  const g = Math.round((color.coords[1] ?? 0) * 255);
  const b = Math.round((color.coords[2] ?? 0) * 255);
  return (255 << 24) | (r << 16) | (g << 8) | b;
}

/**
 * Convert ARGB integer to hex string
 */
function argbToHex(argb: number): string {
  const r = (argb >> 16) & 0xff;
  const g = (argb >> 8) & 0xff;
  const b = argb & 0xff;
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ============================================================================
// Contrast Level Adjustment
// ============================================================================

/**
 * Adjust tones based on contrast level
 *
 * contrastLevel: -1 (reduced) to 1 (high)
 * - Negative: compress tone range toward middle
 * - Zero: use standard tones
 * - Positive: expand tone range toward extremes
 */
function adjustTonesForContrast(
  tones: number[],
  contrastLevel: number
): number[] {
  if (contrastLevel === 0) return tones;

  return tones.map((tone) => {
    // Middle tone is 50
    const distanceFromMiddle = tone - 50;

    if (contrastLevel > 0) {
      // Expand: push tones further from middle
      const expansion = distanceFromMiddle * contrastLevel * 0.3;
      return Math.max(0, Math.min(100, tone + expansion));
    } else {
      // Compress: pull tones closer to middle
      const compression = distanceFromMiddle * Math.abs(contrastLevel) * 0.3;
      return Math.max(0, Math.min(100, tone - compression));
    }
  });
}

// ============================================================================
// Main API
// ============================================================================

/**
 * Generate a color scale using Material HCT
 *
 * HCT provides perceptually uniform color manipulation:
 * - Hue: Color identity (0-360)
 * - Chroma: Colorfulness (0-150+)
 * - Tone: Perceptual lightness (0-100)
 *
 * @param options - Configuration options
 * @returns ScaleOutput with 11 steps (50-950)
 */
export function generateScale(options: MaterialOptions): ScaleOutput {
  const {
    color,
    tones = DEFAULT_TONES,
    chroma: chromaOverride,
    hue: hueOverride,
    contrastLevel = 0,
  } = options;

  // Parse source color
  const argb = hexToArgb(color);
  const sourceHct = Hct.fromInt(argb);

  // Determine final hue and chroma
  const finalHue = hueOverride ?? sourceHct.hue;
  const finalChroma = chromaOverride ?? sourceHct.chroma;

  // Create tonal palette from hue and chroma
  const palette = TonalPalette.fromHueAndChroma(finalHue, finalChroma);

  // Adjust tones based on contrast level
  const adjustedTones = adjustTonesForContrast(tones, contrastLevel);

  // Generate colors at each tone
  const output: Partial<ScaleOutput> = {};

  SCALE_STEPS.forEach((step, index) => {
    if (index < adjustedTones.length) {
      const tone = adjustedTones[index] ?? 50;
      const colorArgb = palette.tone(tone);
      output[step] = argbToHex(colorArgb);
    }
  });

  return output as ScaleOutput;
}

// ============================================================================
// Additional Utilities
// ============================================================================

/**
 * Get HCT values for a color
 * Useful for debugging or advanced use cases
 */
export function getHct(hex: string): { hue: number; chroma: number; tone: number } {
  const argb = hexToArgb(hex);
  const hct = Hct.fromInt(argb);
  return {
    hue: hct.hue,
    chroma: hct.chroma,
    tone: hct.tone,
  };
}

/**
 * Create a color from HCT values
 */
export function fromHct(hue: number, chroma: number, tone: number): string {
  const hct = Hct.from(hue, chroma, tone);
  return argbToHex(hct.toInt());
}

/**
 * Get recommended tones for specific contrast ratios against a background tone
 *
 * Based on HCT's tone-based contrast guarantees:
 * - Tone difference of 40+ ensures ~3:1 contrast
 * - Tone difference of 50+ ensures ~4.5:1 contrast
 * - Tone difference of 60+ ensures ~7:1 contrast
 */
export function getContrastTones(
  backgroundTone: number,
  ratios: number[]
): number[] {
  // Approximate tone differences for common WCAG ratios
  const ratioToToneDiff: Record<number, number> = {
    1.5: 15,
    2: 25,
    3: 40,
    4.5: 50,
    7: 60,
    11: 75,
    15: 85,
  };

  return ratios.map((ratio) => {
    // Find closest ratio in our lookup
    const knownRatios = Object.keys(ratioToToneDiff)
      .map(Number)
      .sort((a, b) => a - b);

    let toneDiff = 40; // Default
    for (const known of knownRatios) {
      if (ratio <= known) {
        toneDiff = ratioToToneDiff[known] ?? 40;
        break;
      }
    }

    // Determine direction based on background
    if (backgroundTone > 50) {
      // Light background: go darker
      return Math.max(0, backgroundTone - toneDiff);
    } else {
      // Dark background: go lighter
      return Math.min(100, backgroundTone + toneDiff);
    }
  });
}

// Re-export types for convenience
export type { MaterialOptions };
