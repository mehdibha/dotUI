"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type {
  ColorSliderControlProps,
  ColorSliderOutputProps,
  ColorSliderProps,
} from "./basic";
import {
  ColorSlider as _ColorSlider,
  ColorSliderControl as _ColorSliderControl,
  ColorSliderOutput as _ColorSliderOutput,
} from "./basic";

export const ColorSlider = createDynamicComponent<ColorSliderProps>(
  "color-slider",
  "ColorSlider",
  _ColorSlider,
  {},
);

export const ColorSliderOutput = createDynamicComponent<ColorSliderOutputProps>(
  "color-slider",
  "ColorSliderOutput",
  _ColorSliderOutput,
  {},
);

export const ColorSliderControl =
  createDynamicComponent<ColorSliderControlProps>(
    "color-slider",
    "ColorSliderControl",
    _ColorSliderControl,
    {},
  );

export type {
  ColorSliderProps,
  ColorSliderControlProps,
  ColorSliderOutputProps,
};
