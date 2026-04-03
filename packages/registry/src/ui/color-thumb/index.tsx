"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./base";
import type { ColorThumbProps } from "./types";

export const ColorThumb = createDynamicComponent<ColorThumbProps>("color-thumb", "ColorThumb", Default.ColorThumb, {});

export type { ColorThumbProps };
