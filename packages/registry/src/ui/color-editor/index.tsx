"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { ColorEditor as _ColorEditor } from "./basic";
import type { ColorEditorProps } from "./types";

export const ColorEditor = createDynamicComponent<ColorEditorProps>(
  "color-editor",
  "ColorEditor",
  _ColorEditor,
  {},
);

export type { ColorEditorProps };
