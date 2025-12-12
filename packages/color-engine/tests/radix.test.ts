/**
 * Tests for Radix blending algorithm
 */

import { describe, it, expect } from "vitest";
import {
  generateScale,
  getRadixScale,
  getRadixScaleNames,
} from "../src/algorithms/radix";
import { hexToRgb, luminance } from "../src/core/utils";
import { SCALE_STEPS } from "../src/core/types";

describe("Radix generateScale", () => {
  describe("basic functionality", () => {
    it("should generate 11 steps", () => {
      const scale = generateScale({
        accent: "#6366f1",
        background: "#ffffff",
      });

      expect(Object.keys(scale)).toHaveLength(11);
      SCALE_STEPS.forEach((step) => {
        expect(scale[step]).toBeDefined();
        expect(scale[step]).toMatch(/^#[0-9a-f]{6}$/);
      });
    });

    it("should generate valid hex colors", () => {
      const scale = generateScale({
        accent: "#ff0000",
        background: "#ffffff",
      });

      Object.values(scale).forEach((color) => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/);
        expect(() => hexToRgb(color)).not.toThrow();
      });
    });
  });

  describe("light mode", () => {
    const scale = generateScale({
      accent: "#3b82f6",
      background: "#ffffff",
    });

    it("should have lighter colors at lower steps", () => {
      const step50Lum = luminance(hexToRgb(scale["50"]));
      const step950Lum = luminance(hexToRgb(scale["950"]));

      expect(step50Lum).toBeGreaterThan(step950Lum);
    });

    it("should maintain monotonic luminance progression", () => {
      const luminances = SCALE_STEPS.map((step) =>
        luminance(hexToRgb(scale[step]))
      );

      // Each step should be darker (lower luminance) than the previous
      for (let i = 1; i < luminances.length; i++) {
        expect(luminances[i]).toBeLessThanOrEqual(luminances[i - 1] + 0.05); // Small tolerance
      }
    });
  });

  describe("dark mode", () => {
    const scale = generateScale({
      accent: "#3b82f6",
      background: "#000000",
    });

    it("should have darker colors at lower steps", () => {
      const step50Lum = luminance(hexToRgb(scale["50"]));
      const step950Lum = luminance(hexToRgb(scale["950"]));

      expect(step50Lum).toBeLessThan(step950Lum);
    });
  });

  describe("color influence", () => {
    it("should produce blue-ish scale for blue accent", () => {
      const scale = generateScale({
        accent: "#3b82f6",
        background: "#ffffff",
      });

      // Check mid-step for blue dominance
      const midRgb = hexToRgb(scale["500"]);
      expect(midRgb[2]).toBeGreaterThan(midRgb[0]); // More blue than red
    });

    it("should produce red-ish scale for red accent", () => {
      const scale = generateScale({
        accent: "#ef4444",
        background: "#ffffff",
      });

      const midRgb = hexToRgb(scale["500"]);
      expect(midRgb[0]).toBeGreaterThan(midRgb[2]); // More red than blue
    });

    it("should produce green-ish scale for green accent", () => {
      const scale = generateScale({
        accent: "#22c55e",
        background: "#ffffff",
      });

      const midRgb = hexToRgb(scale["500"]);
      expect(midRgb[1]).toBeGreaterThan(midRgb[0]); // More green than red
    });
  });

  describe("different accent colors", () => {
    const colors = [
      "#ef4444", // red
      "#22c55e", // green
      "#3b82f6", // blue
      "#f59e0b", // amber
      "#8b5cf6", // violet
      "#ec4899", // pink
      "#14b8a6", // teal
      "#f97316", // orange
    ];

    colors.forEach((accent) => {
      it(`should generate valid scale for ${accent}`, () => {
        const scale = generateScale({
          accent,
          background: "#ffffff",
        });

        expect(Object.keys(scale)).toHaveLength(11);
        Object.values(scale).forEach((hex) => {
          expect(hex).toMatch(/^#[0-9a-f]{6}$/);
        });
      });
    });
  });

  describe("edge cases", () => {
    it("should handle pure white accent", () => {
      const scale = generateScale({
        accent: "#ffffff",
        background: "#ffffff",
      });

      expect(Object.keys(scale)).toHaveLength(11);
    });

    it("should handle pure black accent", () => {
      const scale = generateScale({
        accent: "#000000",
        background: "#ffffff",
      });

      expect(Object.keys(scale)).toHaveLength(11);
    });

    it("should handle gray accent", () => {
      const scale = generateScale({
        accent: "#808080",
        background: "#ffffff",
      });

      expect(Object.keys(scale)).toHaveLength(11);
    });
  });
});

describe("Radix utilities", () => {
  describe("getRadixScale", () => {
    it("should return predefined light scale", () => {
      const blueScale = getRadixScale("blue", "light");

      expect(blueScale).not.toBeNull();
      expect(blueScale).toHaveLength(12);
      blueScale!.forEach((color) => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/);
      });
    });

    it("should return predefined dark scale", () => {
      const blueScale = getRadixScale("blue", "dark");

      expect(blueScale).not.toBeNull();
      expect(blueScale).toHaveLength(12);
    });

    it("should return null for unknown scale", () => {
      const unknown = getRadixScale("notacolor", "light");
      expect(unknown).toBeNull();
    });

    it("should have proper light mode progression", () => {
      const scale = getRadixScale("blue", "light")!;

      // First should be lightest
      const firstLum = luminance(hexToRgb(scale[0]));
      const lastLum = luminance(hexToRgb(scale[11]));

      expect(firstLum).toBeGreaterThan(lastLum);
    });

    it("should have proper dark mode progression", () => {
      const scale = getRadixScale("blue", "dark")!;

      // First should be darkest
      const firstLum = luminance(hexToRgb(scale[0]));
      const lastLum = luminance(hexToRgb(scale[11]));

      expect(firstLum).toBeLessThan(lastLum);
    });
  });

  describe("getRadixScaleNames", () => {
    it("should return array of scale names", () => {
      const names = getRadixScaleNames();

      expect(Array.isArray(names)).toBe(true);
      expect(names.length).toBeGreaterThan(5);

      // Should include common colors
      expect(names).toContain("blue");
      expect(names).toContain("red");
      expect(names).toContain("green");
      expect(names).toContain("gray");
    });

    it("should only return valid scale names", () => {
      const names = getRadixScaleNames();

      names.forEach((name) => {
        expect(getRadixScale(name, "light")).not.toBeNull();
      });
    });
  });
});
