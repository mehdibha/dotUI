"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type {
  ColorSwatchPickerItemProps,
  ColorSwatchPickerProps,
} from "./basic";
import {
  ColorSwatchPicker as _ColorSwatchPicker,
  ColorSwatchPickerItem as _ColorSwatchPickerItem,
} from "./basic";

export const ColorSwatchPicker = createDynamicComponent<ColorSwatchPickerProps>(
  "color-swatch-picker",
  "ColorSwatchPicker",
  _ColorSwatchPicker,
  {},
);

export const ColorSwatchPickerItem =
  createDynamicComponent<ColorSwatchPickerItemProps>(
    "color-swatch-picker",
    "ColorSwatchPickerItem",
    _ColorSwatchPickerItem,
    {},
  );

export type { ColorSwatchPickerProps, ColorSwatchPickerItemProps };
