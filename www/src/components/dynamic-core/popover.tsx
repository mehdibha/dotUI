"use client";

import { createDynamicComponent } from "@/lib/create-dynamic-component";
import {
  Popover as _Popover,
  PopoverProps,
} from "@/registry/core/popover_basic";

export const Popover = createDynamicComponent<PopoverProps>(
  "popover",
  "Popover",
  _Popover,
  {}
);
