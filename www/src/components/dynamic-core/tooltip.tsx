"use client";

import React from "react";
import { createDynamicComponent } from "@/modules/styles/lib/create-dynamic-component";
import {
  Tooltip as _Tooltip,
  TooltipRoot as _TooltipRoot,
  TooltipContent as _TooltipContent,
  TooltipArrow as _TooltipArrow,
} from "@/reg/ui/tooltip.basic";
import type {
  TooltipProps,
  TooltipRootProps,
  TooltipContentProps,
  TooltipArrowProps,
} from "@/reg/ui/tooltip.basic";

export const Tooltip = createDynamicComponent<TooltipProps>(
  "tooltip",
  "Tooltip",
  _Tooltip,
  {
    tooltip_framer: React.lazy(() =>
      // @ts-expect-error - motion modify the props
      import("@/reg/ui/tooltip.motion").then((mod) => ({
        default: mod.Tooltip,
      }))
    ),
  }
);

export const TooltipRoot = createDynamicComponent<TooltipRootProps>(
  "tooltip",
  "TooltipRoot",
  _TooltipRoot,
  {
    tooltip_framer: React.lazy(() =>
      import("@/reg/ui/tooltip.motion").then((mod) => ({
        default: mod.TooltipRoot,
      }))
    ),
  }
);

export const TooltipContent = createDynamicComponent<TooltipContentProps>(
  "tooltip",
  "TooltipContent",
  _TooltipContent,
  {
    tooltip_framer: React.lazy(() =>
      // @ts-expect-error - motion modify the props
      import("@/reg/ui/tooltip.motion").then((mod) => ({
        default: mod.TooltipContent,
      }))
    ),
  }
);

export const TooltipArrow = createDynamicComponent<TooltipArrowProps>(
  "tooltip",
  "TooltipArrow",
  _TooltipArrow,
  {
    tooltip_framer: React.lazy(() =>
      import("@/reg/ui/tooltip.motion").then((mod) => ({
        default: mod.TooltipArrow,
      }))
    ),
  }
);
