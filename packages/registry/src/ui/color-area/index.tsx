"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { ColorArea as _ColorArea } from "./basic";
import type { ColorAreaProps } from "./types";

export const ColorArea = createDynamicComponent<ColorAreaProps>(
  "color-area",
  "ColorArea",
  _ColorArea,
  {},
);

export type { ColorAreaProps };
