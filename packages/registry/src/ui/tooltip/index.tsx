"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type { TooltipContentProps, TooltipProps } from "./types";

export const Tooltip = createDynamicComponent<TooltipProps>("tooltip", "Tooltip", Default.Tooltip, {});

export const TooltipContent = createDynamicComponent<TooltipContentProps>(
	"tooltip",
	"TooltipContent",
	Default.TooltipContent,
	{},
);

export type { TooltipProps, TooltipContentProps };
