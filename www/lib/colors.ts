import { contrast } from "@adobe/leonardo-contrast-colors";
import { parseColor } from "react-aria-components";
import type { ColorTuple } from "@adobe/leonardo-contrast-colors";

export const getContrastTextColor = (color: string): "white" | "black" => {
  const colorValue = parseColor(color).toFormat("rgb");

  const colorTuple: ColorTuple = [
    colorValue.getChannelValue("red"),
    colorValue.getChannelValue("green"),
    colorValue.getChannelValue("blue"),
  ];

  const contrastWithBlack = contrast(colorTuple, [0, 0, 0]);
  const contrastWithWhite = contrast(colorTuple, [255, 255, 255]);

  const contrastText =
    contrastWithBlack > contrastWithWhite ? "black" : "white";

  return contrastText;
};

export type WcagLevel = "AA" | "AAA";
export type WcagSize = "normal" | "large";

export interface WcagCompliance {
  level: WcagLevel;
  size: WcagSize;
  passes: boolean;
  ratio: number;
  required: number;
}

export const getWcagCompliance = (contrastRatio: number): WcagCompliance[] => {
  const wcagStandards = [
    { level: "AA" as const, size: "normal" as const, required: 4.5 },
    { level: "AA" as const, size: "large" as const, required: 3.0 },
    { level: "AAA" as const, size: "normal" as const, required: 7.0 },
    { level: "AAA" as const, size: "large" as const, required: 4.5 },
  ];

  return wcagStandards.map(({ level, size, required }) => ({
    level,
    size,
    passes: contrastRatio >= required,
    ratio: contrastRatio,
    required,
  }));
};

export const getHighestWcagCompliance = (
  contrastRatio: number,
): {
  level: WcagLevel | null;
  size: WcagSize | null;
} => {
  const compliance = getWcagCompliance(contrastRatio);

  if (
    compliance.find((c) => c.level === "AAA" && c.size === "normal" && c.passes)
  ) {
    return { level: "AAA", size: "normal" };
  }
  if (
    compliance.find((c) => c.level === "AAA" && c.size === "large" && c.passes)
  ) {
    return { level: "AAA", size: "large" };
  }
  if (
    compliance.find((c) => c.level === "AA" && c.size === "normal" && c.passes)
  ) {
    return { level: "AA", size: "normal" };
  }
  if (
    compliance.find((c) => c.level === "AA" && c.size === "large" && c.passes)
  ) {
    return { level: "AA", size: "large" };
  }

  return { level: null, size: null };
};
