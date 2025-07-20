"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Overlay as _Overlay } from "../registry/components/overlay/basic";
import type { OverlayProps } from "../registry/components/overlay/basic";

export const Overlay = createDynamicComponent<OverlayProps>(
  "overlay",
  "Overlay",
  _Overlay,
  {
    basic: React.lazy(() =>
      import("../registry/components/overlay/basic").then((mod) => ({
        default: mod.Overlay,
      })),
    ),
  },
);

export type { OverlayProps };
