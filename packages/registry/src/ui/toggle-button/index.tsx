"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./base";
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

export { toggleButtonStyles } from "./base";
export type { ToggleButtonProps };
