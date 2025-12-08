"use client";

import { createDynamicComponent } from "@dotui/registry/ui/create-dynamic-component";

import * as Default from "./basic";
import type {
  ColorSliderControlProps,
  ColorSliderOutputProps,
  ColorSliderProps,
} from "./types";

export const ColorSlider = createDynamicComponent<ColorSliderProps>(
  "color-slider",
  "ColorSlider",
  Default.ColorSlider,
  {},
);

export const ColorSliderOutput = createDynamicComponent<ColorSliderOutputProps>(
  "color-slider",
  "ColorSliderOutput",
  Default.ColorSliderOutput,
  {},
);

export const ColorSliderControl =
  createDynamicComponent<ColorSliderControlProps>(
    "color-slider",
    "ColorSliderControl",
    Default.ColorSliderControl,
    {},
  );

export type {
  ColorSliderProps,
  ColorSliderControlProps,
  ColorSliderOutputProps,
};
