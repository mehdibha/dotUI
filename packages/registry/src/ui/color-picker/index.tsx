"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  ColorPicker as _ColorPicker,
  ColorPickerContent as _ColorPickerContent,
  ColorPickerTrigger as _ColorPickerTrigger,
} from "./basic";
import type {
  ColorPickerContentProps,
  ColorPickerProps,
  ColorPickerTriggerProps,
} from "./types";

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
