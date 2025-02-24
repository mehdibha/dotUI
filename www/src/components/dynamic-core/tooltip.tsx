"use client";

import React from "react";
import {
  Tooltip as _Tooltip,
  TooltipRoot as _TooltipRoot,
  TooltipContent as _TooltipContent,
  TooltipArrow as _TooltipArrow,
} from "@/registry/core/tooltip_basic";
import type {
  TooltipProps,
  TooltipRootProps,
  TooltipContentProps,
  TooltipArrowProps,
} from "@/registry/core/tooltip_basic";
import { createDynamicComponent } from "@/modules/themes/lib/create-dynamic-component";

export const Tooltip = createDynamicComponent<TooltipProps>(
  "tooltip",
  "Tooltip",
  _Tooltip,
  {
    tooltip_framer: React.lazy(() =>
      // @ts-expect-error - motion modify the props
      import("@/registry/core/tooltip_motion").then((mod) => ({
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
      import("@/registry/core/tooltip_motion").then((mod) => ({
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
      import("@/registry/core/tooltip_motion").then((mod) => ({
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
      import("@/registry/core/tooltip_motion").then((mod) => ({
        default: mod.TooltipArrow,
      }))
    ),
  }
);
