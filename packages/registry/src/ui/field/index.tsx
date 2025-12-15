"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type {
	DescriptionProps,
	FieldContentProps,
	FieldErrorProps,
	FieldGroupProps,
	FieldProps,
	FieldsetProps,
	LabelProps,
	LegendProps,
} from "./types";

export const Fieldset = createDynamicComponent<FieldsetProps>("field", "Fieldset", Default.Fieldset, {});

export const Legend = createDynamicComponent<LegendProps>("field", "Legend", Default.Legend, {});

export const FieldGroup = createDynamicComponent<FieldGroupProps>("field", "FieldGroup", Default.FieldGroup, {});

export const Field = createDynamicComponent<FieldProps>("field", "Field", Default.Field, {});

export const FieldContent = createDynamicComponent<FieldContentProps>(
	"field",
	"FieldContent",
	Default.FieldContent,
	{},
);

export const Label = createDynamicComponent<LabelProps>("field", "Label", Default.Label, {});

export const Description = createDynamicComponent<DescriptionProps>("field", "Description", Default.Description, {});

export const FieldError = createDynamicComponent<FieldErrorProps>("field", "FieldError", Default.FieldError, {});

export { fieldStyles } from "./basic";

export type {
	LabelProps,
	DescriptionProps,
	FieldErrorProps,
	FieldGroupProps,
	FieldContentProps,
	FieldsetProps,
	LegendProps,
	FieldProps,
};
