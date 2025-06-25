"use client";

import React from "react";

import { createDynamicComponent } from "../internal/create-dynamic-component";
import {
  Tooltip as _Tooltip,
  TooltipArrow as _TooltipArrow,
  TooltipContent as _TooltipContent,
  TooltipRoot as _TooltipRoot,
} from "../registry/components/tooltip/basic";
import type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipProps,
  TooltipRootProps,
} from "../registry/components/tooltip/basic";

export const Tooltip = createDynamicComponent<TooltipProps>(
  "tooltip",
  "Tooltip",
  _Tooltip,
  {
    tooltip_framer: React.lazy(() =>
      // @ts-expect-error - motion modify the props
      import("../registry/components/tooltip/motion").then((mod) => ({
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
      import("../registry/components/tooltip/motion").then((mod) => ({
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
      import("../registry/components/tooltip/motion").then((mod) => ({
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
      import("../registry/components/tooltip/motion").then((mod) => ({
        default: mod.TooltipArrow,
      })),
    ),
  },
);

export type {
  TooltipProps,
  TooltipRootProps,
  TooltipContentProps,
  TooltipArrowProps,
};
