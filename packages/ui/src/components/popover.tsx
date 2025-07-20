"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Popover as _Popover } from "../registry/components/popover/basic";
import type { PopoverProps } from "../registry/components/popover/basic";

export const Popover = createDynamicComponent<PopoverProps>(
  "popover",
  "Popover",
  _Popover,
  {},
);

export type { PopoverProps };
