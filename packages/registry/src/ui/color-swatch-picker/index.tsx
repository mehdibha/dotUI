"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import * as Default from "./basic";
import type {
  ColorSwatchPickerItemProps,
  ColorSwatchPickerProps,
} from "./types";

export const ColorSwatchPicker = createDynamicComponent<ColorSwatchPickerProps>(
  "color-swatch-picker",
  "ColorSwatchPicker",
  Default.ColorSwatchPicker,
  {},
);

export const ColorSwatchPickerItem =
  createDynamicComponent<ColorSwatchPickerItemProps>(
    "color-swatch-picker",
    "ColorSwatchPickerItem",
    Default.ColorSwatchPickerItem,
    {},
  );

export type { ColorSwatchPickerProps, ColorSwatchPickerItemProps };
