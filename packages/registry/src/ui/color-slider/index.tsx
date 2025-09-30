"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  ColorSlider as _ColorSlider,
  ColorSliderControl as _ColorSliderControl,
  ColorSliderOutput as _ColorSliderOutput,
  ColorSliderRoot as _ColorSliderRoot,
} from "./basic";
import type {
  ColorSliderControlProps,
  ColorSliderOutputProps,
  ColorSliderProps,
  ColorSliderRootProps,
} from "./basic";

export const ColorSlider = createDynamicComponent<ColorSliderProps>(
  "color-slider",
  "ColorSlider",
  _ColorSlider,
  {},
);

export const ColorSliderRoot = createDynamicComponent<ColorSliderRootProps>(
  "color-slider",
  "ColorSliderRoot",
  _ColorSliderRoot,
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
  ColorSliderRootProps,
  ColorSliderControlProps,
  ColorSliderOutputProps,
};
