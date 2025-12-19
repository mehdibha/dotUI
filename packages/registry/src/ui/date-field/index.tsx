"use client";

import type { DateValue } from "react-aria-components";

import { createDynamicComponent } from "@dotui/core/components/create-dynamic-component";

import * as Default from "./basic";
import type { DateFieldProps } from "./types";

export const DateField = <T extends DateValue>(props: DateFieldProps<T>) => {
	const Component = createDynamicComponent<DateFieldProps<T>>("date-field", "DateField", Default.DateField, {});

	return <Component {...props} />;
};

export type { DateFieldProps };
