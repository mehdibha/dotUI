"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type { CheckboxGroupProps } from "./types";

export const CheckboxGroup = createDynamicComponent<CheckboxGroupProps>(
	"checkbox-group",
	"CheckboxGroup",
	Default.CheckboxGroup,
	{},
);

export type { CheckboxGroupProps };
