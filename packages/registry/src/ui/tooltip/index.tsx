"use client";

import React from "react";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  Tooltip as _Tooltip,
  TooltipArrow as _TooltipArrow,
  TooltipContent as _TooltipContent,
  TooltipRoot as _TooltipRoot,
} from "./basic";
import type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipProps,
  TooltipRootProps,
} from "./basic";

export const Tooltip = createDynamicComponent<TooltipProps>(
  "tooltip",
  "Tooltip",
  _Tooltip,
  {
    motion: React.lazy(() =>
      // @ts-expect-error - motion modify the props
      import("./motion").then((mod) => ({
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
    motion: React.lazy(() =>
      import("./motion").then((mod) => ({
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
    motion: React.lazy(() =>
      // @ts-expect-error - motion modify the props
      import("./motion").then((mod) => ({
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
      import("./motion").then((mod) => ({
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
