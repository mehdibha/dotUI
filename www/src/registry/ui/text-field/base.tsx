"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as TextFieldPrimitives from "react-aria-components/TextField";
import type * as React from "react";

import { useStyles } from "./styles";

// MARK: textFieldStyles

// MARK: TextField

interface TextFieldProps extends React.ComponentProps<typeof TextFieldPrimitives.TextField> {}

const TextField = ({ className, ...props }: TextFieldProps) => {
	const textFieldStyles = useStyles();
	return (
		<TextFieldPrimitives.TextField
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
