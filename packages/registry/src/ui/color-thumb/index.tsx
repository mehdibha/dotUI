"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type { ColorThumbProps } from "./types";

export const ColorThumb = createDynamicComponent<ColorThumbProps>("color-thumb", "ColorThumb", Default.ColorThumb, {});

export type { ColorThumbProps };
