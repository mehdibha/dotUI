"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { TooltipContentProps, TooltipProps } from "./basic";
import {
  Tooltip as _Tooltip,
  TooltipContent as _TooltipContent,
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

export type { TooltipProps, TooltipContentProps };
