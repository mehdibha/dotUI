"use client";

import { createDynamicComponent } from "@dotui/core/components/create-dynamic-component";

import * as Default from "./basic";
import type { ColorAreaProps } from "./types";

export const ColorArea = createDynamicComponent<ColorAreaProps>("color-area", "ColorArea", Default.ColorArea, {});

export type { ColorAreaProps };
