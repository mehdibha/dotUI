"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { TextAreaProps } from "../input/basic";
import { TextArea as _TextArea } from "../input/basic";

export const TextArea = createDynamicComponent<TextAreaProps>(
  "text-area",
  "TextArea",
  _TextArea,
  {},
);

export type { TextAreaProps };
