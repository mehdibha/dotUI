"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./base";
import type { ColorSwatchProps } from "./types";

export const ColorSwatch = createDynamicComponent<ColorSwatchProps>(
	"color-swatch",
	"ColorSwatch",
	Default.ColorSwatch,
	{},
);

export type { ColorSwatchProps };
