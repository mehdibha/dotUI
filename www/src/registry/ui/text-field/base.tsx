"use client";

import { TextField as AriaTextField, composeRenderProps } from "react-aria-components";
import type * as React from "react";

import { useStyles } from "./styles";

// MARK: textFieldStyles

// MARK: TextField

interface TextFieldProps extends React.ComponentProps<typeof AriaTextField> {}

const TextField = ({ className, ...props }: TextFieldProps) => {
	const textFieldStyles = useStyles();
	return (
		<AriaTextField
			data-field=""
			data-textfield=""
			data-slot="text-field"
			className={composeRenderProps(className, (className) => textFieldStyles({ className }))}
			{...props}
		/>
	);
};

// MARK: exports

export type { TextFieldProps };
export { TextField };
