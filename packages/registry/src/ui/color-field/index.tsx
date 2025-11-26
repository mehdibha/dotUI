"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import * as Default from "./basic";
import type { ColorFieldProps } from "./types";

export const ColorField = createDynamicComponent<ColorFieldProps>(
  "color-field",
  "ColorField",
  Default.ColorField,
  {},
);

export type { ColorFieldProps };
