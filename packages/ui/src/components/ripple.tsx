"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Ripple as _Ripple } from "../registry/components/ripple";
import type { RippleProps } from "../registry/components/ripple";

export const Ripple = createDynamicComponent<RippleProps>(
  "ripple",
  "Ripple",
  _Ripple,
  {},
);

export type { RippleProps };
