"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { ColorSwatch as _ColorSwatch } from "./basic";
import type { ColorSwatchProps } from "./types";

export const ColorSwatch = createDynamicComponent<ColorSwatchProps>(
  "color-swatch",
  "ColorSwatch",
  _ColorSwatch,
  {},
);

export type { ColorSwatchProps };
