"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { Text as _Text } from "./basic";
import type { TextProps } from "./basic";

export const Text = createDynamicComponent<TextProps>(
  "text",
  "Text",
  _Text,
  {},
);

export type { TextProps };
