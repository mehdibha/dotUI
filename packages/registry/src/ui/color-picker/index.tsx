"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import * as Default from "./basic";
import type {
  ColorPickerContentProps,
  ColorPickerProps,
  ColorPickerTriggerProps,
} from "./types";

export const ColorPicker = createDynamicComponent<ColorPickerProps>(
  "color-picker",
  "ColorPicker",
  Default.ColorPicker,
  {},
);

export const ColorPickerTrigger =
  createDynamicComponent<ColorPickerTriggerProps>(
    "color-picker",
    "ColorPickerTrigger",
    Default.ColorPickerTrigger,
    {},
  );

export const ColorPickerContent =
  createDynamicComponent<ColorPickerContentProps>(
    "color-picker",
    "ColorPickerContent",
    Default.ColorPickerContent,
    {},
  );

export type { ColorPickerProps };
