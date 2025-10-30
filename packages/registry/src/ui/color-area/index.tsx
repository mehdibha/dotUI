"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { ColorAreaProps } from "./basic";
import { ColorArea as _ColorArea } from "./basic";

export const ColorArea = createDynamicComponent<ColorAreaProps>(
  "color-area",
  "ColorArea",
  _ColorArea,
  {},
);

export type { ColorAreaProps };
