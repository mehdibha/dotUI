"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
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
    motion: React.lazy(() =>
      // @ts-expect-error - motion modify the props
      import("../registry/components/tooltip/motion").then((mod) => ({
        default: mod.Tooltip,
      })),
    ),
  },
  true,
);

export const TooltipRoot = createDynamicComponent<TooltipRootProps>(
  "tooltip",
  "TooltipRoot",
  _TooltipRoot,
  {
    motion: React.lazy(() =>
      import("../registry/components/tooltip/motion").then((mod) => ({
        default: mod.TooltipRoot,
      })),
    ),
  },
  true,
);

export const TooltipContent = createDynamicComponent<TooltipContentProps>(
  "tooltip",
  "TooltipContent",
  _TooltipContent,
  {
    motion: React.lazy(() =>
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
    motion: React.lazy(() =>
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
