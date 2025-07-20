"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Separator as _Separator } from "../registry/components/separator/basic";
import type { SeparatorProps } from "../registry/components/separator/basic";

export const Separator = createDynamicComponent<SeparatorProps>(
  "separator",
  "Separator",
  _Separator,
  {
    basic: React.lazy(() =>
      import("../registry/components/separator/basic").then((mod) => ({
        default: mod.Separator,
      })),
    ),
  },
);

export type { SeparatorProps };
