"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  ColorPicker as _ColorPicker,
  ColorPickerButton as _ColorPickerButton,
  ColorPickerEditor as _ColorPickerEditor,
  ColorPickerRoot as _ColorPickerRoot,
} from "../registry/components/color-picker/basic";
import type {
  ColorPickerButtonProps,
  ColorPickerEditorProps,
  ColorPickerProps,
  ColorPickerRootProps,
} from "../registry/components/color-picker/basic";

export const ColorPicker = createDynamicComponent<ColorPickerProps>(
  "color-picker",
  "ColorPicker",
  _ColorPicker,
  {
    basic: React.lazy(() =>
      import("../registry/components/color-picker/basic").then((mod) => ({
        default: mod.ColorPicker,
      })),
    ),
  },
);

export const ColorPickerRoot = createDynamicComponent<ColorPickerRootProps>(
  "color-picker",
  "ColorPickerRoot",
  _ColorPickerRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/color-picker/basic").then((mod) => ({
        default: mod.ColorPickerRoot,
      })),
    ),
  },
);

export const ColorPickerButton = createDynamicComponent<ColorPickerButtonProps>(
  "color-picker",
  "ColorPickerButton",
  _ColorPickerButton,
  {
    basic: React.lazy(() =>
      import("../registry/components/color-picker/basic").then((mod) => ({
        default: mod.ColorPickerButton,
      })),
    ),
  },
);

export const ColorPickerEditor = createDynamicComponent<ColorPickerEditorProps>(
  "color-picker",
  "ColorPickerEditor",
  _ColorPickerEditor,
  {
    basic: React.lazy(() =>
      import("../registry/components/color-picker/basic").then((mod) => ({
        default: mod.ColorPickerEditor,
      })),
    ),
  },
);

export type {
  ColorPickerProps,
  ColorPickerRootProps,
  ColorPickerButtonProps,
  ColorPickerEditorProps,
};
