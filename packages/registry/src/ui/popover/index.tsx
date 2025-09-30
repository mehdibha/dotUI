"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import { Popover as _Popover } from "./basic";
import type { PopoverProps } from "./basic";

export const Popover = createDynamicComponent<PopoverProps>(
  "popover",
  "Popover",
  _Popover,
  {},
);

export type { PopoverProps };
