"use client";

import * as ColorFieldPrimitives from "react-aria-components/ColorField";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import type * as React from "react";

import { useStyles } from "./styles";

// MARK: colorFieldStyles

// MARK: ColorField

interface ColorFieldProps extends React.ComponentProps<typeof ColorFieldPrimitives.ColorField> {}

const ColorField = ({ className, ...props }: ColorFieldProps) => {
	const colorFieldStyles = useStyles();
	return (
		<ColorFieldPrimitives.ColorField
			className={composeRenderProps(className, (className) => colorFieldStyles({ className }))}
			{...props}
		/>
	);
};

// MARK: exports

export type { ColorFieldProps };
export { ColorField };
