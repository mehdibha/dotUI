"use client";

import { useSlotId } from "@react-aria/utils";
import {
	FieldError as AriaFieldError,
	Label as AriaLabel,
	CheckboxContext,
	composeRenderProps,
	LabelContext,
	Provider,
	TextContext,
} from "react-aria-components";
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
						CheckboxContext,
						{
							id: inputId,
							"aria-describedby": descriptionId,
						},
					],
					[LabelContext, { htmlFor: inputId }],
					[TextContext, { slot: "description", id: descriptionId }],
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

interface LabelProps extends React.ComponentProps<typeof AriaLabel> {}

const Label = ({ children, className, ...props }: LabelProps) => {
	const { label } = useStyles()();
	children = useSkeletonText(children);
	return (
		<AriaLabel data-slot="label" data-label="" className={label({ className })} {...props}>
			{children}
		</AriaLabel>
	);
};

// MARK: Description

interface DescriptionProps extends Omit<React.ComponentProps<typeof Text>, "slot"> {}

const Description = ({ className, ...props }: DescriptionProps) => {
	const { description } = useStyles()();
	return <Text data-slot="description" slot="description" className={description({ className })} {...props} />;
};

// MARK: FieldError

interface FieldErrorProps extends React.ComponentProps<typeof AriaFieldError> {}
const FieldError = ({ className, ...props }: FieldErrorProps) => {
	const { fieldError } = useStyles()();
	return (
		<AriaFieldError
			data-slot="field-error"
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
