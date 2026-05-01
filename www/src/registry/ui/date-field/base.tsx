"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DateFieldPrimitive from "react-aria-components/DateField";

import { cn } from "@/registry/lib/utils";
import { useStyles } from "@/registry/ui/field/styles";

// MARK: dateFieldStyles

// MARK: DateField

interface DateFieldProps<T extends DateFieldPrimitive.DateValue> extends DateFieldPrimitive.DateFieldProps<T> {}

const DateField = <T extends DateFieldPrimitive.DateValue>({ className, ...props }: DateFieldProps<T>) => {
	const fieldStyles = useStyles();
	return (
		<DateFieldPrimitive.DateField
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
