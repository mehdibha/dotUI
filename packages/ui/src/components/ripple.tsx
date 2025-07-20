"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Ripple as _Ripple } from "../registry/components/ripple";
import type { RippleProps } from "../registry/components/ripple";

export const Ripple = createDynamicComponent<RippleProps>(
  "ripple",
  "Ripple",
  _Ripple,
  {
    basic: React.lazy(() =>
      import("../registry/components/ripple").then((mod) => ({
        default: mod.Ripple,
      })),
    ),
  },
);

export type { RippleProps };
