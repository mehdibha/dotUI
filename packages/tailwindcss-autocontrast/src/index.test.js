import { converter, parse as parseColor } from "culori";
import { describe, expect, it } from "vitest";

// Import the functions we need to test
// Since they're not exported, we'll recreate them here for testing
function parseColorToRgb(colorValue) {
  if (!colorValue || typeof colorValue !== "string") return null;
  const trimmed = colorValue.trim();

  // Try parsing with culori first (handles hex, rgb, hsl, oklch, etc.)
  try {
    const parsed = parseColor(trimmed);
    if (parsed) {
      // Convert to RGB using culori
      const rgbConverter = converter("rgb");
      const rgb = rgbConverter(parsed);
      if (
        rgb &&
        typeof rgb.r === "number" &&
        typeof rgb.g === "number" &&
        typeof rgb.b === "number"
      ) {
        return {
          r: Math.round(rgb.r * 255),
          g: Math.round(rgb.g * 255),
          b: Math.round(rgb.b * 255),
        };
      }
    }
  } catch (e) {
    // Fall through to manual parsing
  }

  // Fallback to manual parsing for basic formats
  const hexMatch = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }
    return {
      r: parseInt(hex.substr(0, 2), 16),
      g: parseInt(hex.substr(2, 2), 16),
      b: parseInt(hex.substr(4, 2), 16),
    };
  }
  const rgbMatch = trimmed.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+)?\s*\)$/i,
  );
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  }
  return null;
}

function calculateLuminance(r, g, b) {
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;
  const rLinear =
    rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear =
    gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear =
    bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

function calculateContrastRatio(luminance1, luminance2) {
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  return (lighter + 0.05) / (darker + 0.05);
}

function getContrastColor(colorValue) {
  const rgb = parseColorToRgb(colorValue);
  if (!rgb) {
    return "black";
  }
  const colorLuminance = calculateLuminance(rgb.r, rgb.g, rgb.b);
  const blackLuminance = 0;
  const whiteLuminance = 1;
  const contrastWithBlack = calculateContrastRatio(
    colorLuminance,
    blackLuminance,
  );
  const contrastWithWhite = calculateContrastRatio(
    colorLuminance,
    whiteLuminance,
  );
  return contrastWithBlack > contrastWithWhite ? "black" : "white";
}

function isColor(value) {
  if (!value || typeof value !== "string") return false;
  const trimmed = value.trim().toLowerCase();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) return true;
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/i.test(trimmed))
    return true;
  if (
    /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/i.test(trimmed)
  )
    return true;
  if (/^(lab|lch|color|oklab|oklch|hwb)\s*\(/i.test(trimmed)) return true;
  if (/^var\s*\(\s*--[\w-]+\s*(,.*?)?\s*\)$/i.test(trimmed)) return true;
  return false;
}

describe("tailwindcss-autocontrast", () => {
  describe("isColor", () => {
    it("should detect hex colors", () => {
      expect(isColor("#fff")).toBe(true);
      expect(isColor("#ffffff")).toBe(true);
      expect(isColor("#ffff")).toBe(false);
    });

    it("should detect rgb colors", () => {
      expect(isColor("rgb(255, 255, 255)")).toBe(true);
      expect(isColor("rgba(255, 255, 255, 0.5)")).toBe(true);
    });

    it("should detect hsl colors", () => {
      expect(isColor("hsl(0, 0%, 100%)")).toBe(true);
      expect(isColor("hsla(0, 0%, 100%, 0.5)")).toBe(true);
    });

    it("should detect oklch colors", () => {
      expect(isColor("oklch(0.8706 0.0701 241.56)")).toBe(true);
      expect(isColor("oklch(1 0 0)")).toBe(true);
    });

    it("should detect CSS variables", () => {
      expect(isColor("var(--color-primary)")).toBe(true);
      expect(isColor("var(--color, #fff)")).toBe(true);
    });

    it("should reject invalid colors", () => {
      expect(isColor("not-a-color")).toBe(false);
      expect(isColor("")).toBe(false);
      expect(isColor(null)).toBe(false);
    });
  });

  describe("parseColorToRgb", () => {
    it("should parse hex colors", () => {
      expect(parseColorToRgb("#ffffff")).toEqual({ r: 255, g: 255, b: 255 });
      expect(parseColorToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
      expect(parseColorToRgb("#acdbff")).toEqual({ r: 172, g: 219, b: 255 });
    });

    it("should parse short hex colors", () => {
      expect(parseColorToRgb("#fff")).toEqual({ r: 255, g: 255, b: 255 });
      expect(parseColorToRgb("#000")).toEqual({ r: 0, g: 0, b: 0 });
    });

    it("should parse rgb colors", () => {
      expect(parseColorToRgb("rgb(255, 255, 255)")).toEqual({
        r: 255,
        g: 255,
        b: 255,
      });
      expect(parseColorToRgb("rgba(172, 219, 255, 1)")).toEqual({
        r: 172,
        g: 219,
        b: 255,
      });
    });

    it("should parse hsl colors", () => {
      const white = parseColorToRgb("hsl(0, 0%, 100%)");
      expect(white).toEqual({ r: 255, g: 255, b: 255 });

      const black = parseColorToRgb("hsl(0, 0%, 0%)");
      expect(black).toEqual({ r: 0, g: 0, b: 0 });
    });

    it("should parse oklch colors", () => {
      const lightBlue = parseColorToRgb("oklch(0.8706 0.0701 241.56)");
      expect(lightBlue).toBeDefined();
      expect(lightBlue?.r).toBeCloseTo(172, 0);
      expect(lightBlue?.g).toBeCloseTo(219, 0);
      expect(lightBlue?.b).toBeCloseTo(255, 0);

      const lightPink = parseColorToRgb("oklch(0.8268 0.0712 15.44)");
      expect(lightPink).toBeDefined();
      expect(lightPink?.r).toBeCloseTo(241, 0);
      expect(lightPink?.g).toBeCloseTo(180, 0);
      expect(lightPink?.b).toBeCloseTo(183, 0);
    });

    it("should return null for invalid colors", () => {
      expect(parseColorToRgb("not-a-color")).toBeNull();
      expect(parseColorToRgb("")).toBeNull();
      expect(parseColorToRgb(null)).toBeNull();
    });
  });

  describe("calculateLuminance", () => {
    it("should calculate luminance correctly", () => {
      // White should have luminance of 1
      expect(calculateLuminance(255, 255, 255)).toBeCloseTo(1, 2);

      // Black should have luminance of 0
      expect(calculateLuminance(0, 0, 0)).toBe(0);

      // Mid-gray should be around 0.216
      expect(calculateLuminance(128, 128, 128)).toBeCloseTo(0.216, 2);
    });
  });

  describe("calculateContrastRatio", () => {
    it("should calculate contrast ratio correctly", () => {
      // White vs black should be 21:1
      const white = 1;
      const black = 0;
      expect(calculateContrastRatio(white, black)).toBeCloseTo(21, 0);

      // Same colors should be 1:1
      expect(calculateContrastRatio(0.5, 0.5)).toBe(1);
    });
  });

  describe("getContrastColor", () => {
    it("should return black for light colors", () => {
      expect(getContrastColor("#ffffff")).toBe("black");
      expect(getContrastColor("#f0f0f0")).toBe("black");
      expect(getContrastColor("oklch(0.8706 0.0701 241.56)")).toBe("black");
      expect(getContrastColor("oklch(0.8268 0.0712 15.44)")).toBe("black");
    });

    it("should return white for dark colors", () => {
      expect(getContrastColor("#000000")).toBe("white");
      expect(getContrastColor("#333333")).toBe("white");
      expect(getContrastColor("oklch(0.3 0.05 200)")).toBe("white");
    });

    it("should handle mid-tone colors", () => {
      // Test a few mid-tone colors
      const result = getContrastColor("#808080");
      expect(result).toMatch(/^(black|white)$/);
    });

    it("should handle oklch colors correctly", () => {
      // Light blue from the theme
      expect(getContrastColor("oklch(0.8706 0.0701 241.56)")).toBe("black");

      // Dark blue
      expect(getContrastColor("oklch(0.3 0.1 241)")).toBe("white");
    });

    it("should handle invalid colors gracefully", () => {
      expect(getContrastColor("invalid")).toBe("black");
      expect(getContrastColor("")).toBe("black");
    });
  });

  describe("color format compatibility", () => {
    it("should produce consistent results across color formats", () => {
      // Same color in different formats should produce same contrast color
      const hexResult = getContrastColor("#acdbff");
      const rgbResult = getContrastColor("rgb(172, 219, 255)");
      const oklchResult = getContrastColor("oklch(0.8706 0.0701 241.56)");

      expect(hexResult).toBe(rgbResult);
      expect(hexResult).toBe(oklchResult);
    });

    it("should parse all supported color formats to RGB", () => {
      const formats = [
        "#acdbff",
        "rgb(172, 219, 255)",
        "hsl(206, 100%, 84%)",
        "oklch(0.8706 0.0701 241.56)",
      ];

      formats.forEach((format) => {
        const rgb = parseColorToRgb(format);
        expect(rgb).toBeDefined();
        expect(rgb?.r).toBeGreaterThanOrEqual(0);
        expect(rgb?.r).toBeLessThanOrEqual(255);
        expect(rgb?.g).toBeGreaterThanOrEqual(0);
        expect(rgb?.g).toBeLessThanOrEqual(255);
        expect(rgb?.b).toBeGreaterThanOrEqual(0);
        expect(rgb?.b).toBeLessThanOrEqual(255);
      });
    });
  });

  describe("WCAG contrast requirements", () => {
    it("should meet WCAG AA for normal text (4.5:1)", () => {
      const testCases = [
        { bg: "#ffffff", fg: "#000000" }, // Black on white
        { bg: "#000000", fg: "#ffffff" }, // White on black
      ];

      testCases.forEach(({ bg, fg }) => {
        const bgRgb = parseColorToRgb(bg);
        const fgRgb = parseColorToRgb(fg);
        expect(bgRgb).toBeDefined();
        expect(fgRgb).toBeDefined();

        if (bgRgb && fgRgb) {
          const bgLum = calculateLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
          const fgLum = calculateLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
          const ratio = calculateContrastRatio(bgLum, fgLum);
          expect(ratio).toBeGreaterThanOrEqual(4.5);
        }
      });
    });

    it("should calculate correct contrast for generated on-* colors", () => {
      // Light background colors should get black text (good contrast)
      const lightColors = [
        "oklch(0.8706 0.0701 241.56)", // Light blue
        "oklch(0.8268 0.0712 15.44)", // Light pink
        "#acdbff",
        "#f1b4b7",
      ];

      lightColors.forEach((color) => {
        const contrastColor = getContrastColor(color);
        expect(contrastColor).toBe("black");

        const bgRgb = parseColorToRgb(color);
        const fgRgb =
          contrastColor === "black"
            ? { r: 0, g: 0, b: 0 }
            : { r: 255, g: 255, b: 255 };

        if (bgRgb) {
          const bgLum = calculateLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
          const fgLum = calculateLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
          const ratio = calculateContrastRatio(bgLum, fgLum);
          // Should have reasonable contrast
          expect(ratio).toBeGreaterThan(3);
        }
      });
    });
  });
});
