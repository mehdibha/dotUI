"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DateFieldPrimitives from "react-aria-components/DateField";
import type * as CalendarPrimitives from "react-aria-components/Calendar";

import { useStyles } from "./styles";

// MARK: dateFieldStyles

// MARK: DateField

interface DateFieldProps<T extends CalendarPrimitives.DateValue> extends DateFieldPrimitives.DateFieldProps<T> {}

const DateField = <T extends CalendarPrimitives.DateValue>({ className, ...props }: DateFieldProps<T>) => {
	const dateFieldStyles = useStyles();
	return (
		<DateFieldPrimitives.DateField
			className={composeRenderProps(className, (className) => dateFieldStyles({ className }))}
			{...props}
		/>
	);
};

// MARK: exports

export type { DateFieldProps };
export { DateField };
