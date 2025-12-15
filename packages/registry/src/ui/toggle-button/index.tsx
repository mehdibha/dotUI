"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type { ToggleButtonProps } from "./types";

export const ToggleButton = createDynamicComponent<ToggleButtonProps>(
	"toggle-button",
	"ToggleButton",
	Default.ToggleButton,
	{},
);

export const ToggleButtonProvider = createDynamicComponent(
	"toggle-button",
	"ToggleButtonProvider",
	Default.ToggleButtonProvider,
	{},
);

export { toggleButtonStyles } from "./basic";
export type { ToggleButtonProps };
