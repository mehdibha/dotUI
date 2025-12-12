/**
 * Tests for unified API
 */

import { describe, it, expect } from "vitest";
import {
  generateScale,
  generateLeonardoScale,
  generateMaterialScale,
  generateRadixScale,
  SCALE_STEPS,
} from "../src";
import { hexToRgb } from "../src/core/utils";

describe("Unified generateScale", () => {
  describe("algorithm selection", () => {
    it("should route to Leonardo algorithm", () => {
      const unified = generateScale({
        algorithm: "leonardo",
        color: "#6366f1",
        background: "#ffffff",
      });

      const direct = generateLeonardoScale({
        color: "#6366f1",
        background: "#ffffff",
      });

      // Should produce identical results
      expect(unified).toEqual(direct);
    });

    it("should route to Material algorithm", () => {
      const unified = generateScale({
        algorithm: "material",
        color: "#6366f1",
      });

      const direct = generateMaterialScale({
        color: "#6366f1",
      });

      expect(unified).toEqual(direct);
    });

    it("should route to Radix algorithm", () => {
      const unified = generateScale({
        algorithm: "radix",
        accent: "#6366f1",
        background: "#ffffff",
      });

      const direct = generateRadixScale({
        accent: "#6366f1",
        background: "#ffffff",
      });

      expect(unified).toEqual(direct);
    });
  });

  describe("all algorithms produce consistent output shape", () => {
    const algorithms = [
      {
        algorithm: "leonardo" as const,
        color: "#6366f1",
        background: "#ffffff",
      },
      {
        algorithm: "material" as const,
        color: "#6366f1",
      },
      {
        algorithm: "radix" as const,
        accent: "#6366f1",
        background: "#ffffff",
      },
    ];

    algorithms.forEach((input) => {
      it(`should produce 11 valid hex colors for ${input.algorithm}`, () => {
        const scale = generateScale(input);

        expect(Object.keys(scale)).toHaveLength(11);
        SCALE_STEPS.forEach((step) => {
          expect(scale[step]).toBeDefined();
          expect(scale[step]).toMatch(/^#[0-9a-f]{6}$/);
          expect(() => hexToRgb(scale[step])).not.toThrow();
        });
      });
    });
  });

  describe("algorithm options pass through", () => {
    it("should pass Leonardo options", () => {
      const scale = generateScale({
        algorithm: "leonardo",
        color: "#6366f1",
        background: "#ffffff",
        ratios: [1.1, 1.5, 2, 3, 4.5, 6, 8, 10, 12, 14, 16],
        saturation: 80,
        contrast: 1.2,
      });

      expect(Object.keys(scale)).toHaveLength(11);
    });

    it("should pass Material options", () => {
      const scale = generateScale({
        algorithm: "material",
        color: "#6366f1",
        tones: [98, 92, 85, 75, 65, 55, 45, 35, 25, 15, 5],
        hue: 250,
        chroma: 60,
        contrastLevel: 0.5,
      });

      expect(Object.keys(scale)).toHaveLength(11);
    });

    it("should pass Radix options", () => {
      const scale = generateScale({
        algorithm: "radix",
        accent: "#6366f1",
        background: "#121212",
        gray: "#6b7280",
      });

      expect(Object.keys(scale)).toHaveLength(11);
    });
  });
});

describe("Named exports", () => {
  it("should export individual algorithm functions", () => {
    expect(typeof generateLeonardoScale).toBe("function");
    expect(typeof generateMaterialScale).toBe("function");
    expect(typeof generateRadixScale).toBe("function");
  });

  it("should export SCALE_STEPS constant", () => {
    expect(SCALE_STEPS).toEqual([
      "50",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "950",
    ]);
  });
});

describe("Algorithm comparison", () => {
  const testColor = "#3b82f6"; // Blue

  it("all algorithms should produce different results (they use different methods)", () => {
    const leonardo = generateScale({
      algorithm: "leonardo",
      color: testColor,
      background: "#ffffff",
    });

    const material = generateScale({
      algorithm: "material",
      color: testColor,
    });

    const radix = generateScale({
      algorithm: "radix",
      accent: testColor,
      background: "#ffffff",
    });

    // They should not be identical (different algorithms)
    expect(leonardo["500"]).not.toBe(material["500"]);
    expect(material["500"]).not.toBe(radix["500"]);
  });

  it("all algorithms should produce blue-ish results for blue input", () => {
    const leonardo = generateScale({
      algorithm: "leonardo",
      color: testColor,
      background: "#ffffff",
    });

    const material = generateScale({
      algorithm: "material",
      color: testColor,
    });

    const radix = generateScale({
      algorithm: "radix",
      accent: testColor,
      background: "#ffffff",
    });

    // Check that mid-tones are blue-ish (more blue than red)
    [leonardo, material, radix].forEach((scale) => {
      const rgb = hexToRgb(scale["500"]);
      expect(rgb[2]).toBeGreaterThan(rgb[0]); // Blue > Red
    });
  });
});
