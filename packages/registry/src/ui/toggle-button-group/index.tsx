"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./base";
import type { ToggleButtonGroupProps } from "./types";

export const ToggleButtonGroup = createDynamicComponent<ToggleButtonGroupProps>(
	"toggle-button-group",
	"ToggleButtonGroup",
	Default.ToggleButtonGroup,
	{},
);

export type { ToggleButtonGroupProps };
