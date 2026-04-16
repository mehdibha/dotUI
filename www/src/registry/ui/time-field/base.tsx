"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TimeFieldPrimitives from "react-aria-components/TimeField";


import { useStyles } from "./styles";

// MARK: timeFieldStyles

// MARK: TimeField

interface TimeFieldProps<T extends TimeFieldPrimitives.TimeValue> extends TimeFieldPrimitives.TimeFieldProps<T> {}

const TimeField = <T extends TimeFieldPrimitives.TimeValue>({ className, ...props }: TimeFieldProps<T>) => {
	const timeFieldStyles = useStyles();
	return (
		<TimeFieldPrimitives.TimeField
			className={composeRenderProps(className, (className) => timeFieldStyles({ className }))}
			{...props}
		/>
	);
};

// MARK: exports

export type { TimeFieldProps };
export { TimeField };
