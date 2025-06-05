import type { ColorTuple } from "@adobe/leonardo-contrast-colors";
import { contrast } from "@adobe/leonardo-contrast-colors";
import { parseColor } from "react-aria-components";

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
