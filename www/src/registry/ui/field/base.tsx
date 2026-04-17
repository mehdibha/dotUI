"use client";

import { useSlotId } from "react-aria/private/utils/useId";
import * as CheckboxPrimitives from "react-aria-components/Checkbox";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as FieldErrorPrimitives from "react-aria-components/FieldError";
import * as LabelPrimitives from "react-aria-components/Label";
import { Provider } from "react-aria-components/slots";
import * as TextPrimitives from "react-aria-components/Text";
import type React from "react";
import type { VariantProps } from "tailwind-variants";

import { useSkeletonText } from "@/registry/ui/skeleton";
import { Text } from "@/registry/ui/text";

import { useStyles } from "./styles";
import type { FieldStyles } from "./styles";

// MARK: fieldStyles
export { fieldStyles } from "./styles";

// MARK: Fieldset

interface FieldsetProps extends React.ComponentProps<"fieldset"> {}

function Fieldset({ className, ...props }: FieldsetProps) {
	const { fieldset } = useStyles()();
	return <fieldset data-slot="fieldset" className={fieldset({ className })} {...props} />;
}

// MARK: Legend

interface LegendProps extends React.ComponentProps<"legend"> {}

function Legend({ className, ...props }: LegendProps) {
	const { legend } = useStyles()();
	return <legend data-slot="legend" className={legend({ className })} {...props} />;
}

// MARK: FieldGroup

interface FieldGroupProps extends React.ComponentProps<"div"> {}

function FieldGroup({ className, ...props }: FieldGroupProps) {
	const { fieldGroup } = useStyles()();
	return <div data-slot="field-group" className={fieldGroup({ className })} {...props} />;
}

// MARK: Field

interface FieldProps extends React.ComponentProps<"div">, VariantProps<FieldStyles> {}

const Field = ({ children, className, orientation, ...props }: FieldProps) => {
	const { field } = useStyles()();
	const inputId = useSlotId();
	const descriptionId = useSlotId();
	return (
		<div data-slot="field" className={field({ className, orientation })} {...props}>
			<Provider
				values={[
					[
						CheckboxPrimitives.CheckboxContext,
						{
							id: inputId,
							"aria-describedby": descriptionId,
						},
					],
					[LabelPrimitives.LabelContext, { htmlFor: inputId }],
					[TextPrimitives.TextContext, { slot: "description", id: descriptionId }],
				]}
			>
				{children}
			</Provider>
		</div>
	);
};

// MARK: FieldContent

interface FieldContentProps extends React.ComponentProps<"div"> {}

const FieldContent = ({ className, ...props }: FieldContentProps) => {
	const { fieldContent } = useStyles()();
	return <div data-slot="field-content" className={fieldContent({ className })} {...props} />;
};

// MARK: Label

interface LabelProps extends React.ComponentProps<typeof LabelPrimitives.Label> {}

const Label = ({ children, className, ...props }: LabelProps) => {
	const { label } = useStyles()();
	children = useSkeletonText(children);
	return (
		<LabelPrimitives.Label data-slot="label" data-label="" className={label({ className })} {...props}>
			{children}
		</LabelPrimitives.Label>
	);
};

// MARK: Description

interface DescriptionProps extends Omit<React.ComponentProps<typeof Text>, "slot"> {}

const Description = ({ className, ...props }: DescriptionProps) => {
	const { description } = useStyles()();
	return (
		<Text
			data-slot="description"
			data-description=""
			slot="description"
			className={description({ className })}
			{...props}
		/>
	);
};

// MARK: FieldError

interface FieldErrorProps extends React.ComponentProps<typeof FieldErrorPrimitives.FieldError> {}
const FieldError = ({ className, ...props }: FieldErrorProps) => {
	const { fieldError } = useStyles()();
	return (
		<FieldErrorPrimitives.FieldError
			data-slot="field-error"
			data-field-error=""
			className={composeRenderProps(className, (className) => fieldError({ className }))}
			{...props}
		/>
	);
};

// MARK: exports

export type {
	DescriptionProps,
	FieldContentProps,
	FieldErrorProps,
	FieldGroupProps,
	FieldProps,
	FieldsetProps,
	LabelProps,
	LegendProps,
};
export { Description, Field, FieldContent, FieldError, FieldGroup, Fieldset, Label, Legend };
