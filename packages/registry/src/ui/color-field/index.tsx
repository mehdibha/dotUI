"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  ColorField as _ColorField,
  ColorFieldInput as _ColorFieldInput,
  ColorFieldRoot as _ColorFieldRoot,
} from "./basic";
import type {
  ColorFieldInputProps,
  ColorFieldProps,
  ColorFieldRootProps,
} from "./basic";

export const ColorField = createDynamicComponent<ColorFieldProps>(
  "color-field",
  "ColorField",
  _ColorField,
  {},
);

export const ColorFieldRoot = createDynamicComponent<ColorFieldRootProps>(
  "color-field",
  "ColorFieldRoot",
  _ColorFieldRoot,
  {},
);

export const ColorFieldInput = createDynamicComponent<ColorFieldInputProps>(
  "color-field",
  "ColorFieldInput",
  _ColorFieldInput,
  {},
);

export type { ColorFieldProps, ColorFieldRootProps, ColorFieldInputProps };
