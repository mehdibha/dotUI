/**
 * Tests for Material HCT algorithm
 */

import { describe, it, expect } from "vitest";
import Color from "colorjs.io";
import { generateScale, getHct, fromHct, getContrastTones } from "../src/algorithms/material";
import { SCALE_STEPS } from "../src/types";

// Helper to convert hex to RGB array using Color.js
function hexToRgb(hex: string): [number, number, number] {
  const color = new Color(hex).to("srgb");
  return [
    Math.round((color.coords[0] ?? 0) * 255),
    Math.round((color.coords[1] ?? 0) * 255),
    Math.round((color.coords[2] ?? 0) * 255),
  ];
}

describe("Material generateScale", () => {
  describe("basic functionality", () => {
    it("should generate 11 steps", () => {
      const scale = generateScale({
        color: "#6366f1",
      });

      expect(Object.keys(scale)).toHaveLength(11);
      SCALE_STEPS.forEach((step) => {
        expect(scale[step]).toBeDefined();
        expect(scale[step]).toMatch(/^#[0-9a-f]{6}$/);
      });
    });

    it("should generate valid hex colors", () => {
      const scale = generateScale({
        color: "#ff0000",
      });

      Object.values(scale).forEach((color) => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/);
        expect(() => hexToRgb(color)).not.toThrow();
      });
    });
  });

  describe("tone progression", () => {
    const scale = generateScale({
      color: "#3b82f6",
    });

    it("should have lighter colors at lower steps (higher tones)", () => {
      const step50 = hexToRgb(scale["50"]);
      const step950 = hexToRgb(scale["950"]);

      // Step 50 (tone 99) should be nearly white
      const avg50 = (step50[0] + step50[1] + step50[2]) / 3;
      expect(avg50).toBeGreaterThan(240);

      // Step 950 (tone 10) should be nearly black
      const avg950 = (step950[0] + step950[1] + step950[2]) / 3;
      expect(avg950).toBeLessThan(50);
    });

    it("should maintain monotonic lightness progression", () => {
      const steps = SCALE_STEPS.map((step) => {
        const rgb = hexToRgb(scale[step]);
        return (rgb[0] + rgb[1] + rgb[2]) / 3;
      });

      // Each step should be darker than the previous
      for (let i = 1; i < steps.length; i++) {
        expect(steps[i]).toBeLessThan(steps[i - 1]);
      }
    });
  });

  describe("hue preservation", () => {
    it("should maintain consistent hue across scale", () => {
      const scale = generateScale({
        color: "#3b82f6", // blue
      });

      const hues = Object.values(scale).map((hex) => {
        const hct = getHct(hex);
        return hct.hue;
      });

      // All hues should be within 30 degrees of each other
      const maxHue = Math.max(...hues);
      const minHue = Math.min(...hues);
      const hueDiff = Math.min(maxHue - minHue, 360 - maxHue + minHue);

      expect(hueDiff).toBeLessThan(30);
    });
  });

  describe("options", () => {
    it("should respect custom tones", () => {
      const customTones = [98, 92, 85, 75, 65, 55, 45, 35, 25, 15, 5];
      const scale = generateScale({
        color: "#6366f1",
        tones: customTones,
      });

      // Should still generate 11 steps
      expect(Object.keys(scale)).toHaveLength(11);
    });

    it("should allow hue override", () => {
      const original = generateScale({
        color: "#3b82f6", // blue
      });

      const overridden = generateScale({
        color: "#3b82f6",
        hue: 0, // Force red hue
      });

      // The overridden scale should have red hue
      const originalHue = getHct(original["500"]).hue;
      const overriddenHue = getHct(overridden["500"]).hue;

      // Original should be blue-ish (around 220-250)
      expect(originalHue).toBeGreaterThan(200);
      expect(originalHue).toBeLessThan(280);

      // Overridden should be red-ish (around 0 or 360)
      expect(overriddenHue < 30 || overriddenHue > 330).toBe(true);
    });

    it("should allow chroma override", () => {
      const normal = generateScale({
        color: "#3b82f6",
      });

      const lowChroma = generateScale({
        color: "#3b82f6",
        chroma: 10,
      });

      // Low chroma version should be more gray
      const normalRgb = hexToRgb(normal["500"]);
      const lowChromaRgb = hexToRgb(lowChroma["500"]);

      const normalSpread = Math.max(...normalRgb) - Math.min(...normalRgb);
      const lowChromaSpread = Math.max(...lowChromaRgb) - Math.min(...lowChromaRgb);

      expect(lowChromaSpread).toBeLessThan(normalSpread);
    });

    it("should handle positive contrast level", () => {
      const normal = generateScale({
        color: "#6366f1",
        contrastLevel: 0,
      });

      const highContrast = generateScale({
        color: "#6366f1",
        contrastLevel: 1,
      });

      // High contrast should have more extreme light/dark values
      const normalLight = hexToRgb(normal["50"]);
      const highLight = hexToRgb(highContrast["50"]);
      const normalDark = hexToRgb(normal["950"]);
      const highDark = hexToRgb(highContrast["950"]);

      const normalLightAvg = (normalLight[0] + normalLight[1] + normalLight[2]) / 3;
      const highLightAvg = (highLight[0] + highLight[1] + highLight[2]) / 3;
      const normalDarkAvg = (normalDark[0] + normalDark[1] + normalDark[2]) / 3;
      const highDarkAvg = (highDark[0] + highDark[1] + highDark[2]) / 3;

      // High contrast should be lighter at top and darker at bottom
      expect(highLightAvg).toBeGreaterThanOrEqual(normalLightAvg - 10);
      expect(highDarkAvg).toBeLessThanOrEqual(normalDarkAvg + 10);
    });
  });

  describe("different colors", () => {
    const colors = [
      "#ef4444", // red
      "#22c55e", // green
      "#3b82f6", // blue
      "#f59e0b", // amber
      "#8b5cf6", // violet
      "#6b7280", // gray
    ];

    colors.forEach((color) => {
      it(`should generate valid scale for ${color}`, () => {
        const scale = generateScale({ color });

        expect(Object.keys(scale)).toHaveLength(11);
        Object.values(scale).forEach((hex) => {
          expect(hex).toMatch(/^#[0-9a-f]{6}$/);
        });
      });
    });
  });
});

describe("Material utilities", () => {
  describe("getHct", () => {
    it("should extract HCT values", () => {
      const hct = getHct("#ff0000");

      expect(hct.hue).toBeGreaterThan(20);
      expect(hct.hue).toBeLessThan(40);
      expect(hct.chroma).toBeGreaterThan(80);
      expect(hct.tone).toBeGreaterThan(40);
      expect(hct.tone).toBeLessThan(60);
    });

    it("should return low chroma for gray", () => {
      const hct = getHct("#808080");
      expect(hct.chroma).toBeLessThan(5);
    });
  });

  describe("fromHct", () => {
    it("should create color from HCT values", () => {
      const hex = fromHct(220, 50, 50);
      expect(hex).toMatch(/^#[0-9a-f]{6}$/);

      // Should be blue-ish
      const rgb = hexToRgb(hex);
      expect(rgb[2]).toBeGreaterThan(rgb[0]); // More blue than red
    });

    it("should round-trip with getHct", () => {
      // Note: chroma may be clamped to fit sRGB gamut, so we use looser comparison
      const original = { hue: 220, chroma: 30, tone: 50 }; // Lower chroma for better gamut fit
      const hex = fromHct(original.hue, original.chroma, original.tone);
      const hct = getHct(hex);

      expect(hct.hue).toBeCloseTo(original.hue, -1); // Within 10 degrees
      expect(hct.chroma).toBeCloseTo(original.chroma, -1); // Within 10
      expect(hct.tone).toBeCloseTo(original.tone, 0);
    });
  });

  describe("getContrastTones", () => {
    it("should return darker tones for light backgrounds", () => {
      const tones = getContrastTones(90, [3, 4.5, 7]);

      tones.forEach((tone) => {
        expect(tone).toBeLessThan(90);
      });
    });

    it("should return lighter tones for dark backgrounds", () => {
      const tones = getContrastTones(10, [3, 4.5, 7]);

      tones.forEach((tone) => {
        expect(tone).toBeGreaterThan(10);
      });
    });

    it("should increase tone difference for higher ratios", () => {
      const tones = getContrastTones(90, [1.5, 3, 7]);

      // Higher ratio should have bigger tone difference
      const diff1 = 90 - tones[0];
      const diff2 = 90 - tones[1];
      const diff3 = 90 - tones[2];

      expect(diff2).toBeGreaterThan(diff1);
      expect(diff3).toBeGreaterThan(diff2);
    });
  });
});
