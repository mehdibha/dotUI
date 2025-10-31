"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { TextProps } from "./basic";
import { Text as _Text } from "./basic";

export const Text = createDynamicComponent<TextProps>(
  "text",
  "Text",
  _Text,
  {},
);

export type { TextProps };
