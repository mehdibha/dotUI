"use client";

import React from "react";

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
  {
    basic: React.lazy(() =>
      import("../registry/components/color-area/basic").then((mod) => ({
        default: mod.ColorArea,
      })),
    ),
  },
);

export const ColorAreaRoot = createDynamicComponent<ColorAreaRootProps>(
  "color-area",
  "ColorAreaRoot",
  _ColorAreaRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/color-area/basic").then((mod) => ({
        default: mod.ColorAreaRoot,
      })),
    ),
  },
);

export type { ColorAreaProps, ColorAreaRootProps };
