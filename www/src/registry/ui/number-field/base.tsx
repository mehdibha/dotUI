"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import * as ButtonPrimitives from "react-aria-components/Button";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as NumberFieldPrimitives from "react-aria-components/NumberField";
import { Provider, useSlottedContext } from "react-aria-components/slots";
import type * as React from "react";

import { fieldStyles } from "@/registry/ui/field";

interface NumberFieldProps extends React.ComponentProps<typeof NumberFieldPrimitives.NumberField> {}
const NumberField = ({ className, ...props }: NumberFieldProps) => {
	return (
		<NumberFieldPrimitives.NumberField
			data-slot="number-field"
			className={composeRenderProps(className, (className) => fieldStyles().field({ className }))}
			{...props}
		>
			{composeRenderProps(props.children, (children) => (
				<NumberFieldInner>{children}</NumberFieldInner>
			))}
		</NumberFieldPrimitives.NumberField>
	);
};

const NumberFieldInner = ({ children }: { children: React.ReactNode }) => {
	const incrementBtnCtx = useSlottedContext(ButtonPrimitives.ButtonContext, "increment");
	const decrementBtnCtx = useSlottedContext(ButtonPrimitives.ButtonContext, "decrement");
	return (
		<Provider
			values={[
				[
					ButtonPrimitives.ButtonContext,
					{
						slots: {
							increment: { ...incrementBtnCtx, children: <PlusIcon /> },
							decrement: { ...decrementBtnCtx, children: <MinusIcon /> },
						},
					},
				],
			]}
		>
			{children}
		</Provider>
	);
};

export type { NumberFieldProps };
export { NumberField };
