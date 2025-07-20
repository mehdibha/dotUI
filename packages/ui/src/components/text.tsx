"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Text as _Text } from "../registry/components/text/basic";
import type { TextProps } from "../registry/components/text/basic";

export const Text = createDynamicComponent<TextProps>("text", "Text", _Text, {
  basic: React.lazy(() =>
    import("../registry/components/text/basic").then((mod) => ({
      default: mod.Text,
    })),
  ),
});

export type { TextProps };
