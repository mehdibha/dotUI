"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { ColorThumb as _ColorThumb } from "./basic";
import type { ColorThumbProps } from "./basic";

export const ColorThumb = createDynamicComponent<ColorThumbProps>(
  "color-thumb",
  "ColorThumb",
  _ColorThumb,
  {},
);

export type { ColorThumbProps };
