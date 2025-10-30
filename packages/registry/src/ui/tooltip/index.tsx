"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipProps,
} from "./basic";
import {
  Tooltip as _Tooltip,
  TooltipArrow as _TooltipArrow,
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

export const TooltipArrow = createDynamicComponent<TooltipArrowProps>(
  "tooltip",
  "TooltipArrow",
  _TooltipArrow,
  {},
);

export type { TooltipProps, TooltipContentProps, TooltipArrowProps };
