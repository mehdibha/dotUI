"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type { ColorSwatchProps } from "./types";

export const ColorSwatch = createDynamicComponent<ColorSwatchProps>(
	"color-swatch",
	"ColorSwatch",
	Default.ColorSwatch,
	{},
);

export type { ColorSwatchProps };
