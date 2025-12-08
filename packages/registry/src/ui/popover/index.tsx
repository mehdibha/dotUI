"use client";

import { createDynamicComponent } from "@dotui/registry/ui/create-dynamic-component";

import * as Default from "./basic";
import type { PopoverProps } from "./types";

export const Popover = createDynamicComponent<PopoverProps>(
  "popover",
  "Popover",
  Default.Popover,
  {},
);

export type { PopoverProps };
