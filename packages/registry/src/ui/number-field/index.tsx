"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type { NumberFieldProps } from "./types";

export const NumberField = createDynamicComponent<NumberFieldProps>(
	"number-field",
	"NumberField",
	Default.NumberField,
	{},
);

export type { NumberFieldProps };
