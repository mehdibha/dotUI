"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  ColorSlider as _ColorSlider,
  ColorSliderControl as _ColorSliderControl,
  ColorSliderOutput as _ColorSliderOutput,
  ColorSliderRoot as _ColorSliderRoot,
} from "../registry/components/color-slider/basic";
import type {
  ColorSliderControlProps,
  ColorSliderOutputProps,
  ColorSliderProps,
  ColorSliderRootProps,
} from "../registry/components/color-slider/basic";

export const ColorSlider = createDynamicComponent<ColorSliderProps>(
  "color-slider",
  "ColorSlider",
  _ColorSlider,
  {
    basic: React.lazy(() =>
      import("../registry/components/color-slider/basic").then((mod) => ({
        default: mod.ColorSlider,
      })),
    ),
  },
);

export const ColorSliderRoot = createDynamicComponent<ColorSliderRootProps>(
  "color-slider",
  "ColorSliderRoot",
  _ColorSliderRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/color-slider/basic").then((mod) => ({
        default: mod.ColorSliderRoot,
      })),
    ),
  },
);

export const ColorSliderOutput = createDynamicComponent<ColorSliderOutputProps>(
  "color-slider",
  "ColorSliderOutput",
  _ColorSliderOutput,
  {
    basic: React.lazy(() =>
      import("../registry/components/color-slider/basic").then((mod) => ({
        default: mod.ColorSliderOutput,
      })),
    ),
  },
);

export const ColorSliderControl =
  createDynamicComponent<ColorSliderControlProps>(
    "color-slider",
    "ColorSliderControl",
    _ColorSliderControl,
    {
      basic: React.lazy(() =>
        import("../registry/components/color-slider/basic").then((mod) => ({
          default: mod.ColorSliderControl,
        })),
      ),
    },
  );

export type {
  ColorSliderProps,
  ColorSliderRootProps,
  ColorSliderControlProps,
  ColorSliderOutputProps,
};
