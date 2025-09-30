"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  ColorSwatchPicker as _ColorSwatchPicker,
  ColorSwatchPickerItem as _ColorSwatchPickerItem,
} from "./basic";
import type {
  ColorSwatchPickerItemProps,
  ColorSwatchPickerProps,
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
