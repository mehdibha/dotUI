"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type { ColorEditorProps } from "./types";

export const ColorEditor = createDynamicComponent<ColorEditorProps>(
	"color-editor",
	"ColorEditor",
	Default.ColorEditor,
	{},
);

export type { ColorEditorProps };
