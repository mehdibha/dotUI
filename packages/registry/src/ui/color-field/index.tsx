"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { ColorFieldProps } from "./basic";
import { ColorField as _ColorField } from "./basic";

export const ColorField = createDynamicComponent<ColorFieldProps>(
  "color-field",
  "ColorField",
  _ColorField,
  {},
);

export type { ColorFieldProps };
