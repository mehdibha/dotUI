"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Popover as _Popover } from "../registry/components/popover/basic";
import type { PopoverProps } from "../registry/components/popover/basic";

export const Popover = createDynamicComponent<PopoverProps>(
  "popover",
  "Popover",
  _Popover,
  {
    basic: React.lazy(() =>
      import("../registry/components/popover/basic").then((mod) => ({
        default: mod.Popover,
      })),
    ),
  },
);

export type { PopoverProps };
