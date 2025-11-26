"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  Tooltip as _Tooltip,
  TooltipContent as _TooltipContent,
} from "./basic";
import type { TooltipContentProps, TooltipProps } from "./types";

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
