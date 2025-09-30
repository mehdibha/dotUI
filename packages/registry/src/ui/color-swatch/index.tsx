"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import { ColorSwatch as _ColorSwatch } from "./basic";
import type { ColorSwatchProps } from "./basic";

export const ColorSwatch = createDynamicComponent<ColorSwatchProps>(
  "color-swatch",
  "ColorSwatch",
  _ColorSwatch,
  {},
);

export type { ColorSwatchProps };
