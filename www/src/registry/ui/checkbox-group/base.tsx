"use client";

import * as CheckboxGroupPrimitives from "react-aria-components/CheckboxGroup";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { tv } from "tailwind-variants";

const checkboxGroupStyles = tv({
	base: "flex flex-col gap-3",
});

const CheckboxGroup = ({ className, ...props }: CheckboxGroupPrimitives.CheckboxGroupProps) => {
	return (
		<CheckboxGroupPrimitives.CheckboxGroup
			className={composeRenderProps(className, (className) => checkboxGroupStyles({ className }))}
			{...props}
		/>
	);
};

type CheckboxGroupProps = CheckboxGroupPrimitives.CheckboxGroupProps;

export type { CheckboxGroupProps };
export { CheckboxGroup };
