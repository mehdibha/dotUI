"use client";

import type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipProps,
  TooltipRootProps,
} from "@/__registry__/components/tooltip/basic";
import React from "react";
import {
  Tooltip as _Tooltip,
  TooltipArrow as _TooltipArrow,
  TooltipContent as _TooltipContent,
  TooltipRoot as _TooltipRoot,
} from "@/__registry__/components/tooltip/basic";
import { createDynamicComponent } from "@/internal/create-dynamic-component";

export const Tooltip = createDynamicComponent<TooltipProps>(
  "tooltip",
  "Tooltip",
  _Tooltip,
  {
    tooltip_framer: React.lazy(() =>
      // @ts-expect-error - motion modify the props
      import("@/__registry__/components/tooltip/motion").then((mod) => ({
        default: mod.Tooltip,
      })),
    ),
  },
);

export const TooltipRoot = createDynamicComponent<TooltipRootProps>(
  "tooltip",
  "TooltipRoot",
  _TooltipRoot,
  {
    tooltip_framer: React.lazy(() =>
      import("@/__registry__/components/tooltip/motion").then((mod) => ({
        default: mod.TooltipRoot,
      })),
    ),
  },
);

export const TooltipContent = createDynamicComponent<TooltipContentProps>(
  "tooltip",
  "TooltipContent",
  _TooltipContent,
  {
    tooltip_framer: React.lazy(() =>
      // @ts-expect-error - motion modify the props
      import("@/__registry__/components/tooltip/motion").then((mod) => ({
        default: mod.TooltipContent,
      })),
    ),
  },
);

export const TooltipArrow = createDynamicComponent<TooltipArrowProps>(
  "tooltip",
  "TooltipArrow",
  _TooltipArrow,
  {
    tooltip_framer: React.lazy(() =>
      import("@/__registry__/components/tooltip/motion").then((mod) => ({
        default: mod.TooltipArrow,
      })),
    ),
  },
);
