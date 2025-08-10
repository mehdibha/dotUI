"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  ColorArea as _ColorArea,
  ColorAreaRoot as _ColorAreaRoot,
} from "../registry/components/color-area/basic";
import type {
  ColorAreaProps,
  ColorAreaRootProps,
} from "../registry/components/color-area/basic";

export const ColorArea = createDynamicComponent<ColorAreaProps>(
  "color-area",
  "ColorArea",
  _ColorArea,
  {},
);

export const ColorAreaRoot = createDynamicComponent<ColorAreaRootProps>(
  "color-area",
  "ColorAreaRoot",
  _ColorAreaRoot,
  {},
);

export type { ColorAreaProps, ColorAreaRootProps };
