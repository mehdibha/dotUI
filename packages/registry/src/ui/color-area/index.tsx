"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  ColorArea as _ColorArea,
  ColorAreaRoot as _ColorAreaRoot,
} from "./basic";
import type { ColorAreaProps, ColorAreaRootProps } from "./basic";

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
