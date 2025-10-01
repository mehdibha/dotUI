"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  ColorPicker as _ColorPicker,
  ColorPickerButton as _ColorPickerButton,
  ColorPickerEditor as _ColorPickerEditor,
  ColorPickerRoot as _ColorPickerRoot,
} from "./basic";
import type {
  ColorPickerButtonProps,
  ColorPickerEditorProps,
  ColorPickerProps,
  ColorPickerRootProps,
} from "./basic";

export const ColorPicker = createDynamicComponent<ColorPickerProps>(
  "color-picker",
  "ColorPicker",
  _ColorPicker,
  {},
);

export const ColorPickerRoot = createDynamicComponent<ColorPickerRootProps>(
  "color-picker",
  "ColorPickerRoot",
  _ColorPickerRoot,
  {},
);

export const ColorPickerButton = createDynamicComponent<ColorPickerButtonProps>(
  "color-picker",
  "ColorPickerButton",
  _ColorPickerButton,
  {},
);

export const ColorPickerEditor = createDynamicComponent<ColorPickerEditorProps>(
  "color-picker",
  "ColorPickerEditor",
  _ColorPickerEditor,
  {},
);

export type {
  ColorPickerProps,
  ColorPickerRootProps,
  ColorPickerButtonProps,
  ColorPickerEditorProps,
};
