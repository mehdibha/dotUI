"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { ColorField as _ColorField } from "./basic";
import type { ColorFieldProps } from "./types";

export const ColorField = createDynamicComponent<ColorFieldProps>(
  "color-field",
  "ColorField",
  _ColorField,
  {},
);

export type { ColorFieldProps };
