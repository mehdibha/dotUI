/**
 * Radix Colors Algorithm
 *
 * A simplified implementation of Radix UI's color scale generation.
 * Uses Delta E OK distance to find the closest predefined scales
 * and blends between them based on the input color.
 *
 * Original: https://github.com/radix-ui/colors
 * License: MIT
 */

import type { RadixOptions, ScaleOutput, RGB, OKLCH } from "../../core/types";
import {
  hexToRgb,
  rgbToHex,
  rgbToOklch,
  oklchToRgb,
  luminance,
  lerp,
  SCALE_STEPS,
} from "../../core/utils";

// ============================================================================
// Predefined Radix Color Scales (Step 6 as reference)
// ============================================================================

/**
 * Reference colors at step 6 (middle of scale) for each Radix color
 * These are used to find the closest scale via Delta E
 */
const RADIX_REFERENCE_COLORS: Record<string, string> = {
  // Grays
  gray: "#868e96",
  mauve: "#8e8c99",
  slate: "#8b8d98",
  sage: "#868e8b",
  olive: "#898e87",
  sand: "#8f8b82",

  // Colors
  tomato: "#ec5e42",
  red: "#e5484d",
  ruby: "#e54666",
  crimson: "#e93d82",
  pink: "#d6409f",
  plum: "#ab4aba",
  purple: "#8e4ec6",
  violet: "#6e56cf",
  iris: "#5b5bd6",
  indigo: "#3e63dd",
  blue: "#0090ff",
  cyan: "#00a2c7",
  teal: "#12a594",
  jade: "#29a383",
  green: "#30a46c",
  grass: "#46a758",
  brown: "#ad7f58",
  bronze: "#a18072",
  gold: "#978365",
  sky: "#7ce2fe",
  mint: "#86ead4",
  lime: "#bdee63",
  yellow: "#ffe629",
  amber: "#ffc53d",
  orange: "#f76b15",
};

/**
 * Full 12-step scales for light mode
 * Step 1 = lightest, Step 12 = darkest
 */
const RADIX_LIGHT_SCALES: Record<string, string[]> = {
  gray: [
    "#fcfcfc", "#f9f9f9", "#f0f0f0", "#e8e8e8", "#e0e0e0", "#d9d9d9",
    "#cecece", "#bbbbbb", "#8d8d8d", "#838383", "#646464", "#202020",
  ],
  mauve: [
    "#fdfcfd", "#faf9fb", "#f2eff3", "#eae7ec", "#e3dfe6", "#dbd8e0",
    "#d0cdd7", "#bcbac7", "#8e8c99", "#84828e", "#65636d", "#211f26",
  ],
  slate: [
    "#fcfcfd", "#f9f9fb", "#f0f0f3", "#e8e8ec", "#e0e1e6", "#d9d9e0",
    "#cdced6", "#b9bbc6", "#8b8d98", "#80838d", "#60646c", "#1c2024",
  ],
  blue: [
    "#fbfdff", "#f4faff", "#e6f4fe", "#d5efff", "#c2e5ff", "#acd8fc",
    "#8ec8f6", "#5eb1ef", "#0090ff", "#0588f0", "#0d74ce", "#113264",
  ],
  green: [
    "#fbfefc", "#f4fbf6", "#e6f6eb", "#d6f1df", "#c4e8d1", "#adddc0",
    "#8eceaa", "#5bb98b", "#30a46c", "#2b9a66", "#218358", "#193b2d",
  ],
  red: [
    "#fffcfc", "#fff7f7", "#feebec", "#ffdbdc", "#ffcdce", "#fdbdbe",
    "#f4a9aa", "#eb8e90", "#e5484d", "#dc3e42", "#ce2c31", "#641723",
  ],
  orange: [
    "#fefcfb", "#fff7ed", "#ffefd6", "#ffdfb5", "#ffd19a", "#ffc182",
    "#f5ae73", "#ec9455", "#f76b15", "#ef5f00", "#cc4e00", "#582d1d",
  ],
  yellow: [
    "#fdfdf9", "#fefce9", "#fffab8", "#fff394", "#ffe770", "#f3d768",
    "#e4c767", "#d5ae49", "#ffe629", "#ffdc00", "#9e6c00", "#473b1f",
  ],
  purple: [
    "#fefcfe", "#fbf7fe", "#f7edfe", "#f2e2fc", "#ead5f9", "#e0c4f4",
    "#d1afec", "#be93e4", "#8e4ec6", "#8347b9", "#6f3a9e", "#2b0e44",
  ],
  pink: [
    "#fffcfe", "#fef7fb", "#fee9f5", "#fbdcef", "#f6cee7", "#efbfdd",
    "#e7acd0", "#dd93c2", "#d6409f", "#cf3897", "#c2298a", "#651249",
  ],
  cyan: [
    "#fafdfe", "#f2fafb", "#def7f9", "#caf1f6", "#b5e9f0", "#9ddde7",
    "#7dcedc", "#52bece", "#00a2c7", "#0797b9", "#107d98", "#0d3c48",
  ],
  teal: [
    "#fafefd", "#f3fbf9", "#e0f8f3", "#ccf3eb", "#b8ece1", "#a1e3d4",
    "#83d6c4", "#53c5af", "#12a594", "#0d9b8a", "#067a6f", "#0d3d38",
  ],
};

/**
 * Full 12-step scales for dark mode
 */
const RADIX_DARK_SCALES: Record<string, string[]> = {
  gray: [
    "#111111", "#191919", "#222222", "#2a2a2a", "#313131", "#3a3a3a",
    "#484848", "#606060", "#6e6e6e", "#7b7b7b", "#b4b4b4", "#eeeeee",
  ],
  mauve: [
    "#121113", "#1a191b", "#232225", "#2b292d", "#323035", "#3c393f",
    "#49474e", "#625f69", "#6f6d78", "#7c7a85", "#b5b2bc", "#eeeef0",
  ],
  slate: [
    "#111113", "#18191b", "#212225", "#272a2d", "#2e3135", "#363a3f",
    "#43484e", "#5a6169", "#696e77", "#777b84", "#b0b4ba", "#edeef0",
  ],
  blue: [
    "#0d1520", "#111927", "#0d2847", "#003362", "#004074", "#104d87",
    "#205d9e", "#2870bd", "#0090ff", "#3b9eff", "#70b8ff", "#c2e6ff",
  ],
  green: [
    "#0e1512", "#121b17", "#132d21", "#113b29", "#174933", "#20573e",
    "#28684a", "#2f7c57", "#30a46c", "#33b074", "#3dd68c", "#b1f1cb",
  ],
  red: [
    "#191111", "#201314", "#3b1219", "#500f1c", "#611623", "#72232d",
    "#8c333a", "#b54548", "#e5484d", "#ec5d5e", "#ff9592", "#ffd1d9",
  ],
  orange: [
    "#17120e", "#1e160f", "#331e0b", "#462100", "#562800", "#66350c",
    "#7e451d", "#a35829", "#f76b15", "#ff801f", "#ffa057", "#ffe0c2",
  ],
  yellow: [
    "#14120b", "#1b180f", "#2d2305", "#362b00", "#433500", "#524202",
    "#665417", "#836a21", "#ffe629", "#ffff57", "#f5e147", "#f6eeb4",
  ],
  purple: [
    "#18111b", "#1e1523", "#301c3b", "#3d224e", "#48295c", "#54346b",
    "#664282", "#7e5ba7", "#8e4ec6", "#9a5cd0", "#c191f2", "#ecd9fa",
  ],
  pink: [
    "#191117", "#21121d", "#37172f", "#4b143d", "#591c47", "#692955",
    "#833869", "#a84f85", "#d6409f", "#de51a8", "#ff8dcc", "#fdd1ea",
  ],
  cyan: [
    "#0b161a", "#101b20", "#082c36", "#003848", "#004558", "#045468",
    "#12677e", "#11809c", "#00a2c7", "#23afd0", "#4ccce6", "#b6ecf7",
  ],
  teal: [
    "#0d1514", "#111c1b", "#0d2d2a", "#023b37", "#084843", "#145750",
    "#1c6961", "#207e73", "#12a594", "#0eb39e", "#0bd8b6", "#adf0dd",
  ],
};

// ============================================================================
// Delta E OK Distance
// ============================================================================

/**
 * Calculate Delta E OK distance between two colors
 * This is a perceptually uniform color difference metric
 */
function deltaEOk(color1: OKLCH, color2: OKLCH): number {
  const dL = color1.l - color2.l;
  const dC = color1.c - color2.c;

  // Handle hue difference (shortest path around circle)
  let dH = color1.h - color2.h;
  if (dH > 180) dH -= 360;
  if (dH < -180) dH += 360;

  // Convert hue difference to chord length
  const avgC = (color1.c + color2.c) / 2;
  const dHChord = 2 * avgC * Math.sin((dH * Math.PI) / 360);

  return Math.sqrt(dL * dL + dC * dC + dHChord * dHChord);
}

/**
 * Find the closest Radix scale to a given color
 */
function findClosestScale(color: string): { name: string; distance: number }[] {
  const inputOklch = rgbToOklch(hexToRgb(color));

  const distances = Object.entries(RADIX_REFERENCE_COLORS).map(([name, refHex]) => {
    const refOklch = rgbToOklch(hexToRgb(refHex));
    return {
      name,
      distance: deltaEOk(inputOklch, refOklch),
    };
  });

  // Sort by distance (closest first)
  return distances.sort((a, b) => a.distance - b.distance);
}

// ============================================================================
// Color Blending
// ============================================================================

/**
 * Blend two OKLCH colors
 */
function blendOklch(c1: OKLCH, c2: OKLCH, t: number): OKLCH {
  // Handle hue interpolation (shortest path)
  let h1 = c1.h;
  let h2 = c2.h;
  const diff = h2 - h1;

  if (diff > 180) h1 += 360;
  else if (diff < -180) h2 += 360;

  let h = lerp(h1, h2, t) % 360;
  if (h < 0) h += 360;

  return {
    l: lerp(c1.l, c2.l, t),
    c: lerp(c1.c, c2.c, t),
    h,
  };
}

/**
 * Blend two hex colors
 */
function blendHex(hex1: string, hex2: string, t: number): string {
  const c1 = rgbToOklch(hexToRgb(hex1));
  const c2 = rgbToOklch(hexToRgb(hex2));
  const blended = blendOklch(c1, c2, t);
  return rgbToHex(oklchToRgb(blended));
}

/**
 * Blend two color scales
 */
function blendScales(scale1: string[], scale2: string[], t: number): string[] {
  return scale1.map((color, i) => blendHex(color, scale2[i] ?? color, t));
}

// ============================================================================
// Background Adaptation
// ============================================================================

/**
 * Determine if background is light or dark
 */
function isLightBackground(background: string): boolean {
  const rgb = hexToRgb(background);
  return luminance(rgb) > 0.5;
}

/**
 * Adjust scale for a specific background
 * This shifts the scale to ensure proper contrast
 */
function adjustScaleForBackground(
  scale: string[],
  background: string,
  isLight: boolean
): string[] {
  const bgOklch = rgbToOklch(hexToRgb(background));

  return scale.map((hex, index) => {
    const oklch = rgbToOklch(hexToRgb(hex));

    // Adjust lightness based on step and background
    // Steps 1-2 should be close to background
    // Steps 11-12 should have high contrast
    if (isLight) {
      // Light mode: step 1 should be near-white, step 12 near-black
      const targetL = 1 - (index / 11) * 0.95;
      const adjusted: OKLCH = {
        ...oklch,
        l: lerp(oklch.l, targetL, 0.3), // Gentle adjustment
      };
      return rgbToHex(oklchToRgb(adjusted));
    } else {
      // Dark mode: step 1 should be near-black, step 12 near-white
      const targetL = (index / 11) * 0.95;
      const adjusted: OKLCH = {
        ...oklch,
        l: lerp(oklch.l, targetL, 0.3),
      };
      return rgbToHex(oklchToRgb(adjusted));
    }
  });
}

// ============================================================================
// Main API
// ============================================================================

/**
 * Generate a color scale using Radix-style blending
 *
 * The algorithm:
 * 1. Find the two closest predefined Radix scales via Delta E OK
 * 2. Calculate blend ratio based on distances
 * 3. Blend the scales in OKLCH space
 * 4. Adjust for the target background
 *
 * @param options - Configuration options
 * @returns ScaleOutput with 11 steps (50-950)
 */
export function generateScale(options: RadixOptions): ScaleOutput {
  const { accent, background, gray } = options;

  // Determine light/dark mode from background
  const isLight = isLightBackground(background);
  const scales = isLight ? RADIX_LIGHT_SCALES : RADIX_DARK_SCALES;

  // Find closest scales
  const closest = findClosestScale(accent);
  const primary = closest[0] ?? { name: "gray", distance: 0 };
  const secondary = closest[1] ?? { name: "gray", distance: 0 };

  // Get the scales (fallback to gray if not found)
  const grayScale = scales.gray!;
  const primaryScale = scales[primary.name] ?? grayScale;
  const secondaryScale = scales[secondary.name] ?? grayScale;

  // Calculate blend ratio using tangent-based method (Radix style)
  // When distance is 0, use 100% primary
  // As distance increases, blend more with secondary
  const totalDist = primary.distance + secondary.distance;
  const blendRatio = totalDist > 0 ? secondary.distance / totalDist : 1;

  // Blend the two scales
  let blendedScale = blendScales(primaryScale, secondaryScale, 1 - blendRatio);

  // Adjust hue toward the accent color
  const accentOklch = rgbToOklch(hexToRgb(accent));
  blendedScale = blendedScale.map((hex, index) => {
    const oklch = rgbToOklch(hexToRgb(hex));
    // Stronger hue influence in the middle steps (4-9)
    const hueInfluence = index >= 3 && index <= 8 ? 0.6 : 0.3;
    const adjusted = blendOklch(oklch, { ...oklch, h: accentOklch.h }, hueInfluence);
    return rgbToHex(oklchToRgb(adjusted));
  });

  // Adjust for background
  blendedScale = adjustScaleForBackground(blendedScale, background, isLight);

  // Map 12-step Radix scale to 11-step output
  // We'll skip step 1 (too close to background) and use steps 2-12
  const mappedScale = [
    blendedScale[1],  // 50
    blendedScale[2],  // 100
    blendedScale[3],  // 200
    blendedScale[4],  // 300
    blendedScale[5],  // 400
    blendedScale[6],  // 500
    blendedScale[7],  // 600
    blendedScale[8],  // 700
    blendedScale[9],  // 800
    blendedScale[10], // 900
    blendedScale[11], // 950
  ];

  // Build output
  const output: Partial<ScaleOutput> = {};
  SCALE_STEPS.forEach((step, index) => {
    output[step] = mappedScale[index];
  });

  return output as ScaleOutput;
}

/**
 * Get a predefined Radix scale by name
 */
export function getRadixScale(
  name: string,
  mode: "light" | "dark" = "light"
): string[] | null {
  const scales = mode === "light" ? RADIX_LIGHT_SCALES : RADIX_DARK_SCALES;
  return scales[name] || null;
}

/**
 * Get all available Radix scale names (only those with full scale definitions)
 */
export function getRadixScaleNames(): string[] {
  return Object.keys(RADIX_LIGHT_SCALES);
}

// Re-export types
export type { RadixOptions };
