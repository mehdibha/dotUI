"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { ColorSwatchProps } from "./basic";
import { ColorSwatch as _ColorSwatch } from "./basic";

export const ColorSwatch = createDynamicComponent<ColorSwatchProps>(
  "color-swatch",
  "ColorSwatch",
  _ColorSwatch,
  {},
);

export type { ColorSwatchProps };
