"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Text as _Text } from "../registry/components/text/basic";
import type { TextProps } from "../registry/components/text/basic";

export const Text = createDynamicComponent<TextProps>(
  "text",
  "Text",
  _Text,
  {},
);

export type { TextProps };
