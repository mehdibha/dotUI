"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type {
  TooltipContentProps,
  TooltipProps,
  TooltipTriggerProps,
} from "./basic";
import {
  Tooltip as _Tooltip,
  TooltipContent as _TooltipContent,
  TooltipTrigger as _TooltipTrigger,
} from "./basic";

export const Tooltip = createDynamicComponent<TooltipProps>(
  "tooltip",
  "Tooltip",
  _Tooltip,
  {},
);

export const TooltipContent = createDynamicComponent<TooltipContentProps>(
  "tooltip",
  "TooltipContent",
  _TooltipContent,
  {},
);

export const TooltipTrigger = createDynamicComponent<TooltipTriggerProps>(
  "tooltip",
  "TooltipTrigger",
  _TooltipTrigger,
  {},
);

export type { TooltipProps, TooltipContentProps };
