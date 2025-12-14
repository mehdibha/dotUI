/**
 * Tests for core utility functions
 */

import { describe, it, expect } from "vitest";
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToOklch,
  oklchToRgb,
  luminance,
  contrastRatio,
  isValidHex,
  getContrastTextColor,
  clamp,
} from "../src/core/utils";

describe("hexToRgb", () => {
  it("should convert 6-digit hex to RGB", () => {
    expect(hexToRgb("#ffffff")).toEqual([255, 255, 255]);
    expect(hexToRgb("#000000")).toEqual([0, 0, 0]);
    expect(hexToRgb("#ff0000")).toEqual([255, 0, 0]);
    expect(hexToRgb("#00ff00")).toEqual([0, 255, 0]);
    expect(hexToRgb("#0000ff")).toEqual([0, 0, 255]);
  });

  it("should convert 3-digit hex to RGB", () => {
    expect(hexToRgb("#fff")).toEqual([255, 255, 255]);
    expect(hexToRgb("#000")).toEqual([0, 0, 0]);
    expect(hexToRgb("#f00")).toEqual([255, 0, 0]);
  });

  it("should handle hex without #", () => {
    expect(hexToRgb("ffffff")).toEqual([255, 255, 255]);
    expect(hexToRgb("000")).toEqual([0, 0, 0]);
  });

  it("should throw for invalid hex", () => {
    expect(() => hexToRgb("#gg0000")).toThrow();
    expect(() => hexToRgb("#12345")).toThrow();
  });
});

describe("rgbToHex", () => {
  it("should convert RGB to hex", () => {
    expect(rgbToHex([255, 255, 255])).toBe("#ffffff");
    expect(rgbToHex([0, 0, 0])).toBe("#000000");
    expect(rgbToHex([255, 0, 0])).toBe("#ff0000");
  });

  it("should clamp values", () => {
    expect(rgbToHex([300, 0, 0])).toBe("#ff0000");
    expect(rgbToHex([-10, 0, 0])).toBe("#000000");
  });
});

describe("rgbToHsl / hslToRgb", () => {
  it("should round-trip white", () => {
    const rgb: [number, number, number] = [255, 255, 255];
    const hsl = rgbToHsl(rgb);
    const back = hslToRgb(hsl);
    expect(back).toEqual(rgb);
  });

  it("should round-trip black", () => {
    const rgb: [number, number, number] = [0, 0, 0];
    const hsl = rgbToHsl(rgb);
    const back = hslToRgb(hsl);
    expect(back).toEqual(rgb);
  });

  it("should round-trip red", () => {
    const rgb: [number, number, number] = [255, 0, 0];
    const hsl = rgbToHsl(rgb);
    expect(hsl.h).toBeCloseTo(0);
    expect(hsl.s).toBeCloseTo(100);
    expect(hsl.l).toBeCloseTo(50);
  });

  it("should round-trip gray", () => {
    const rgb: [number, number, number] = [128, 128, 128];
    const hsl = rgbToHsl(rgb);
    const back = hslToRgb(hsl);
    expect(back[0]).toBeCloseTo(rgb[0], -1);
    expect(back[1]).toBeCloseTo(rgb[1], -1);
    expect(back[2]).toBeCloseTo(rgb[2], -1);
  });
});

describe("rgbToOklch / oklchToRgb", () => {
  it("should round-trip white", () => {
    const rgb: [number, number, number] = [255, 255, 255];
    const oklch = rgbToOklch(rgb);
    expect(oklch.l).toBeCloseTo(1, 1);
    expect(oklch.c).toBeCloseTo(0, 1);

    const back = oklchToRgb(oklch);
    expect(back[0]).toBeCloseTo(255, -1);
    expect(back[1]).toBeCloseTo(255, -1);
    expect(back[2]).toBeCloseTo(255, -1);
  });

  it("should round-trip black", () => {
    const rgb: [number, number, number] = [0, 0, 0];
    const oklch = rgbToOklch(rgb);
    expect(oklch.l).toBeCloseTo(0, 1);

    const back = oklchToRgb(oklch);
    expect(back[0]).toBeCloseTo(0, -1);
    expect(back[1]).toBeCloseTo(0, -1);
    expect(back[2]).toBeCloseTo(0, -1);
  });

  it("should round-trip saturated colors", () => {
    const rgb: [number, number, number] = [100, 150, 200];
    const oklch = rgbToOklch(rgb);
    const back = oklchToRgb(oklch);
    expect(back[0]).toBeCloseTo(rgb[0], -1);
    expect(back[1]).toBeCloseTo(rgb[1], -1);
    expect(back[2]).toBeCloseTo(rgb[2], -1);
  });
});

describe("luminance", () => {
  it("should return 1 for white", () => {
    expect(luminance([255, 255, 255])).toBeCloseTo(1, 2);
  });

  it("should return 0 for black", () => {
    expect(luminance([0, 0, 0])).toBeCloseTo(0, 2);
  });

  it("should handle gray correctly", () => {
    const gray = luminance([128, 128, 128]);
    expect(gray).toBeGreaterThan(0.1);
    expect(gray).toBeLessThan(0.3);
  });
});

describe("contrastRatio", () => {
  it("should return 21 for black on white", () => {
    expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 0);
  });

  it("should return 21 for white on black", () => {
    expect(contrastRatio([255, 255, 255], [0, 0, 0])).toBeCloseTo(21, 0);
  });

  it("should return 1 for same colors", () => {
    expect(contrastRatio([128, 128, 128], [128, 128, 128])).toBeCloseTo(1, 1);
  });

  it("should calculate gray on white correctly", () => {
    // #cfcfcf on white should be around 1.55:1
    const ratio = contrastRatio([207, 207, 207], [255, 255, 255]);
    expect(ratio).toBeGreaterThan(1.4);
    expect(ratio).toBeLessThan(1.7);
  });
});

describe("isValidHex", () => {
  it("should accept valid hex colors", () => {
    expect(isValidHex("#fff")).toBe(true);
    expect(isValidHex("#ffffff")).toBe(true);
    expect(isValidHex("fff")).toBe(true);
    expect(isValidHex("FFFFFF")).toBe(true);
    expect(isValidHex("#ABC")).toBe(true);
  });

  it("should reject invalid hex colors", () => {
    expect(isValidHex("#gg0000")).toBe(false);
    expect(isValidHex("#12345")).toBe(false);
    expect(isValidHex("not a color")).toBe(false);
    expect(isValidHex("#1234567")).toBe(false);
  });
});

describe("getContrastTextColor", () => {
  it("should return black for white background", () => {
    expect(getContrastTextColor("#ffffff")).toBe("#000000");
  });

  it("should return white for black background", () => {
    expect(getContrastTextColor("#000000")).toBe("#ffffff");
  });

  it("should return appropriate color for mid-tones", () => {
    // Light gray should get black text
    expect(getContrastTextColor("#dddddd")).toBe("#000000");
    // Dark gray should get white text
    expect(getContrastTextColor("#333333")).toBe("#ffffff");
  });
});

describe("clamp", () => {
  it("should clamp values", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });
});
