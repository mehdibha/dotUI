"use client";

import { ColorField as AriaColorField, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";

import { fieldStyles } from "@dotui/registry/ui/field/basic";

const colorFieldStyles = tv({
	base: [fieldStyles().field({ orientation: "vertical" }), ""],
});

interface ColorFieldProps extends React.ComponentProps<typeof AriaColorField> {}

const ColorField = ({ className, ...props }: ColorFieldProps) => {
	return (
		<AriaColorField
			className={composeRenderProps(className, (className) => colorFieldStyles({ className }))}
			{...props}
		/>
	);
};

export { ColorField };
export type { ColorFieldProps };
