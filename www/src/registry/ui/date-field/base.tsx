"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DateFieldPrimitives from "react-aria-components/DateField";
import type * as CalendarPrimitives from "react-aria-components/Calendar";

import { cn } from "@/registry/lib/utils";
import { useStyles } from "@/registry/ui/field/styles";

// MARK: dateFieldStyles

// MARK: DateField

interface DateFieldProps<T extends CalendarPrimitives.DateValue> extends DateFieldPrimitives.DateFieldProps<T> {}

const DateField = <T extends CalendarPrimitives.DateValue>({ className, ...props }: DateFieldProps<T>) => {
	const fieldStyles = useStyles();
	return (
		<DateFieldPrimitives.DateField
			date-date-field=""
			className={composeRenderProps(className, (className) =>
				fieldStyles().field({ className: cn("group/date-field", className) }),
			)}
			{...props}
		/>
	);
};

// MARK: exports

export type { DateFieldProps };
export { DateField };
