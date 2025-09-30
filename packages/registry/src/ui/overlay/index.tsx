"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import { Overlay as _Overlay } from "./basic";
import type { OverlayProps } from "./basic";

export const Overlay = createDynamicComponent<OverlayProps>(
  "overlay",
  "Overlay",
  _Overlay,
  {},
);

export type { OverlayProps };
