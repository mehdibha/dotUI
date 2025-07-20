"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  ColorField as _ColorField,
  ColorFieldInput as _ColorFieldInput,
  ColorFieldRoot as _ColorFieldRoot,
} from "../registry/components/color-field/basic";
import type {
  ColorFieldInputProps,
  ColorFieldProps,
  ColorFieldRootProps,
} from "../registry/components/color-field/basic";

export const ColorField = createDynamicComponent<ColorFieldProps>(
  "color-field",
  "ColorField",
  _ColorField,
  {
    basic: React.lazy(() =>
      import("../registry/components/color-field/basic").then((mod) => ({
        default: mod.ColorField,
      })),
    ),
  },
);

export const ColorFieldRoot = createDynamicComponent<ColorFieldRootProps>(
  "color-field",
  "ColorFieldRoot",
  _ColorFieldRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/color-field/basic").then((mod) => ({
        default: mod.ColorFieldRoot,
      })),
    ),
  },
);

export const ColorFieldInput = createDynamicComponent<ColorFieldInputProps>(
  "color-field",
  "ColorFieldInput",
  _ColorFieldInput,
  {
    basic: React.lazy(() =>
      import("../registry/components/color-field/basic").then((mod) => ({
        default: mod.ColorFieldInput,
      })),
    ),
  },
);

export type { ColorFieldProps, ColorFieldRootProps, ColorFieldInputProps };
