"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  ColorSwatchPicker as _ColorSwatchPicker,
  ColorSwatchPickerItem as _ColorSwatchPickerItem,
} from "../registry/components/color-swatch-picker/basic";
import type {
  ColorSwatchPickerItemProps,
  ColorSwatchPickerProps,
} from "../registry/components/color-swatch-picker/basic";

export const ColorSwatchPicker = createDynamicComponent<ColorSwatchPickerProps>(
  "color-swatch-picker",
  "ColorSwatchPicker",
  _ColorSwatchPicker,
  {
    basic: React.lazy(() =>
      import("../registry/components/color-swatch-picker/basic").then(
        (mod) => ({
          default: mod.ColorSwatchPicker,
        }),
      ),
    ),
  },
);

export const ColorSwatchPickerItem =
  createDynamicComponent<ColorSwatchPickerItemProps>(
    "color-swatch-picker",
    "ColorSwatchPickerItem",
    _ColorSwatchPickerItem,
    {
      basic: React.lazy(() =>
        import("../registry/components/color-swatch-picker/basic").then(
          (mod) => ({
            default: mod.ColorSwatchPickerItem,
          }),
        ),
      ),
    },
  );

export type { ColorSwatchPickerProps, ColorSwatchPickerItemProps };
