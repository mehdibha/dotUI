"use client";

import * as CheckboxGroupPrimitives from "react-aria-components/CheckboxGroup";
import { composeRenderProps } from "react-aria-components/composeRenderProps";


import { fieldStyles } from "@/registry/ui/field";

const { field } = fieldStyles();

const CheckboxGroup = ({ className, ...props }: CheckboxGroupPrimitives.CheckboxGroupProps) => {
	return (
		<CheckboxGroupPrimitives.CheckboxGroup className={composeRenderProps(className, (className) => field({ className }))} {...props} />
	);
};

type CheckboxGroupProps = CheckboxGroupPrimitives.CheckboxGroupProps;
export type { CheckboxGroupProps };
export { CheckboxGroup };
