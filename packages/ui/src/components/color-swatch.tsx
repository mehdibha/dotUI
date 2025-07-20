"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { ColorSwatch as _ColorSwatch } from "../registry/components/color-swatch/basic";
import type { ColorSwatchProps } from "../registry/components/color-swatch/basic";

export const ColorSwatch = createDynamicComponent<ColorSwatchProps>(
  "color-swatch",
  "ColorSwatch",
  _ColorSwatch,
  {
    basic: React.lazy(() =>
      import("../registry/components/color-swatch/basic").then((mod) => ({
        default: mod.ColorSwatch,
      })),
    ),
  },
);

export type { ColorSwatchProps };
