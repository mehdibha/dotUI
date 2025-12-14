"use client";

import { createDynamicComponent } from "@dotui/registry/ui/create-dynamic-component";

import * as Default from "./basic";
import type { ColorThumbProps } from "./types";

export const ColorThumb = createDynamicComponent<ColorThumbProps>(
  "color-thumb",
  "ColorThumb",
  Default.ColorThumb,
  {},
);

export type { ColorThumbProps };
