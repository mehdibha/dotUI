"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Skeleton as _Skeleton } from "../registry/components/skeleton/basic";

export const Skeleton = createDynamicComponent<
  React.HTMLAttributes<HTMLDivElement> & { show?: boolean }
>(
  "skeleton",
  "Skeleton",
  _Skeleton,
  {
    basic: React.lazy(() =>
      import("../registry/components/skeleton/basic").then((mod) => ({
        default: mod.Skeleton,
      })),
    ),
  },
);
