"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./base";
import type { NumberFieldProps } from "./types";

export const NumberField = createDynamicComponent<NumberFieldProps>(
	"number-field",
	"NumberField",
	Default.NumberField,
	{},
);

export type { NumberFieldProps };
