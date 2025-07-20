"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { ColorThumb as _ColorThumb } from "../registry/components/color-thumb/basic";
import type { ColorThumbProps } from "../registry/components/color-thumb/basic";

export const ColorThumb = createDynamicComponent<ColorThumbProps>(
  "color-thumb",
  "ColorThumb",
  _ColorThumb,
  {},
);

export type { ColorThumbProps };
