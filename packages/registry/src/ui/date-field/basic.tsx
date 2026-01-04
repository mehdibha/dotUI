"use client";

import { DateField as AriaDateField, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";
import type { DateFieldProps as AriaDateFieldProps, DateValue } from "react-aria-components";

import { fieldStyles } from "@dotui/registry/ui/field";

const dateFieldStyles = tv({
	base: [fieldStyles().field({ orientation: "vertical" })],
});

/* -----------------------------------------------------------------------------------------------*/

interface DateFieldProps<T extends DateValue> extends AriaDateFieldProps<T> {}

const DateField = <T extends DateValue>({ className, ...props }: DateFieldProps<T>) => {
	return (
		<AriaDateField
			className={composeRenderProps(className, (className) => dateFieldStyles({ className }))}
			{...props}
		/>
	);
};

export type { DateFieldProps };
export { DateField };
