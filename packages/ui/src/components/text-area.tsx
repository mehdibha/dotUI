"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  TextArea as _TextArea,
  TextAreaRoot as _TextAreaRoot,
} from "../registry/components/text-area/basic";
import type {
  TextAreaProps,
  TextAreaRootProps,
} from "../registry/components/text-area/basic";

export const TextArea = createDynamicComponent<TextAreaProps>(
  "text-area",
  "TextArea",
  _TextArea,
  {},
);

export const TextAreaRoot = createDynamicComponent<TextAreaRootProps>(
  "text-area",
  "TextAreaRoot",
  _TextAreaRoot,
  {},
);

export type { TextAreaProps, TextAreaRootProps };
