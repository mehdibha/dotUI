"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type {
  ColorPickerContentProps,
  ColorPickerProps,
  ColorPickerTriggerProps,
} from "./basic";
import {
  ColorPicker as _ColorPicker,
  ColorPickerContent as _ColorPickerContent,
  ColorPickerTrigger as _ColorPickerTrigger,
} from "./basic";

export const ColorPicker = createDynamicComponent<ColorPickerProps>(
  "color-picker",
  "ColorPicker",
  _ColorPicker,
  {},
);

export const ColorPickerTrigger =
  createDynamicComponent<ColorPickerTriggerProps>(
    "color-picker",
    "ColorPickerTrigger",
    _ColorPickerTrigger,
    {},
  );

export const ColorPickerContent =
  createDynamicComponent<ColorPickerContentProps>(
    "color-picker",
    "ColorPickerContent",
    _ColorPickerContent,
    {},
  );

export type { ColorPickerProps };
