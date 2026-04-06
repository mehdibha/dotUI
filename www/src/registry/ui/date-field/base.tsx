"use client";

import { DateField as AriaDateField, composeRenderProps } from "react-aria-components";
import type { DateFieldProps as AriaDateFieldProps, DateValue } from "react-aria-components";

import { useStyles } from "./styles";

// MARK: dateFieldStyles

// MARK: DateField

interface DateFieldProps<T extends DateValue> extends AriaDateFieldProps<T> {}

const DateField = <T extends DateValue>({ className, ...props }: DateFieldProps<T>) => {
	const dateFieldStyles = useStyles();
	return (
		<AriaDateField
			className={composeRenderProps(className, (className) => dateFieldStyles({ className }))}
			{...props}
		/>
	);
};

// MARK: exports

export type { DateFieldProps };
export { DateField };
