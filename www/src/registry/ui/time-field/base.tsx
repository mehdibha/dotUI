"use client";

import { TimeField as AriaTimeField, composeRenderProps } from "react-aria-components";
import type { TimeFieldProps as AriaTimeFieldProps, TimeValue } from "react-aria-components";

import { useStyles } from "./styles";

// MARK: timeFieldStyles

// MARK: TimeField

interface TimeFieldProps<T extends TimeValue> extends AriaTimeFieldProps<T> {}

const TimeField = <T extends TimeValue>({ className, ...props }: TimeFieldProps<T>) => {
	const timeFieldStyles = useStyles();
	return (
		<AriaTimeField
			className={composeRenderProps(className, (className) => timeFieldStyles({ className }))}
			{...props}
		/>
	);
};

// MARK: exports

export type { TimeFieldProps };
export { TimeField };
