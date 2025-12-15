"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type { ToggleButtonGroupProps } from "./types";

export const ToggleButtonGroup = createDynamicComponent<ToggleButtonGroupProps>(
	"toggle-button-group",
	"ToggleButtonGroup",
	Default.ToggleButtonGroup,
	{},
);

export type { ToggleButtonGroupProps };
