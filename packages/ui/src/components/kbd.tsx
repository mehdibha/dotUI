"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Kbd as _Kbd, KbdStyles } from "../registry/components/kbd/basic";
import type { KbdProps } from "../registry/components/kbd/basic";

export const Kbd = createDynamicComponent<KbdProps>("kbd", "Kbd", _Kbd, {
  basic: React.lazy(() =>
    import("../registry/components/kbd/basic").then((mod) => ({
      default: mod.Kbd,
    })),
  ),
});

export { KbdStyles };
export type { KbdProps };
