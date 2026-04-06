"use client";

import { ColorField as AriaColorField, composeRenderProps } from "react-aria-components";
import type * as React from "react";

import { useStyles } from "./styles";

// MARK: colorFieldStyles

// MARK: ColorField

interface ColorFieldProps extends React.ComponentProps<typeof AriaColorField> {}

const ColorField = ({ className, ...props }: ColorFieldProps) => {
	const colorFieldStyles = useStyles();
	return (
		<AriaColorField
			className={composeRenderProps(className, (className) => colorFieldStyles({ className }))}
			{...props}
		/>
	);
};

// MARK: exports

export { ColorField };
export type { ColorFieldProps };
