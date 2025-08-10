"use client";

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
