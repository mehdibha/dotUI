"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { ColorEditorProps } from "./basic";
import { ColorEditor as _ColorEditor } from "./basic";

export const ColorEditor = createDynamicComponent<ColorEditorProps>(
  "color-editor",
  "ColorEditor",
  _ColorEditor,
  {},
);

export type { ColorEditorProps };
