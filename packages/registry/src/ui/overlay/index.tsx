"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { OverlayProps } from "./basic";
import { Overlay as _Overlay } from "./basic";

export const Overlay = createDynamicComponent<OverlayProps>(
  "overlay",
  "Overlay",
  _Overlay,
  {},
);

export type { OverlayProps };
