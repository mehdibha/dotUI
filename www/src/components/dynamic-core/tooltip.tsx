"use client";

import React from "react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import {
  TooltipProps,
  TooltipRootProps,
  TooltipContentProps,
  TooltipArrowProps,
} from "@/registry/core/tooltip-01";

export const Tooltip = createDynamicComponent<TooltipProps>(
  "tooltip",
  "Tooltip",
  {
    "tooltip-01": React.lazy(() =>
      import("@/registry/core/tooltip-01").then((mod) => ({
        default: mod.Tooltip,
      }))
    ),
  }
);

export const TooltipRoot = createDynamicComponent<TooltipRootProps>(
  "tooltip",
  "TooltipRoot",
  {
    "tooltip-01": React.lazy(() =>
      import("@/registry/core/tooltip-01").then((mod) => ({
        default: mod.TooltipRoot,
      }))
    ),
  }
);

export const TooltipContent = createDynamicComponent<TooltipContentProps>(
  "tooltip",
  "TooltipContent",
  {
    "tooltip-01": React.lazy(() =>
      import("@/registry/core/tooltip-01").then((mod) => ({
        default: mod.TooltipContent,
      }))
    ),
  }
);

export const TooltipArrow = createDynamicComponent<TooltipArrowProps>(
  "tooltip",
  "TooltipArrow",
  {
    "tooltip-01": React.lazy(() =>
      import("@/registry/core/tooltip-01").then((mod) => ({
        default: mod.TooltipArrow,
      }))
    ),
  }
);
