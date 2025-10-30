"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type {
  DescriptionProps,
  FieldContentProps,
  FieldErrorProps,
  FieldGroupProps,
  FieldProps,
  FieldsetProps,
  LabelProps,
  LegendProps,
} from "./basic";
import {
  Description as _Description,
  Field as _Field,
  FieldContent as _FieldContent,
  FieldError as _FieldError,
  FieldGroup as _FieldGroup,
  Fieldset as _Fieldset,
  Label as _Label,
  Legend as _Legend,
} from "./basic";

export const Fieldset = createDynamicComponent<FieldsetProps>(
  "field",
  "Fieldset",
  _Fieldset,
  {},
);

export const Legend = createDynamicComponent<LegendProps>(
  "field",
  "Legend",
  _Legend,
  {},
);

export const FieldGroup = createDynamicComponent<FieldGroupProps>(
  "field",
  "FieldGroup",
  _FieldGroup,
  {},
);

export const Field = createDynamicComponent<FieldProps>(
  "field",
  "Field",
  _Field,
  {},
);

export const FieldContent = createDynamicComponent<FieldContentProps>(
  "field",
  "FieldContent",
  _FieldContent,
  {},
);

export const Label = createDynamicComponent<LabelProps>(
  "field",
  "Label",
  _Label,
  {},
);

export const Description = createDynamicComponent<DescriptionProps>(
  "field",
  "Description",
  _Description,
  {},
);

export const FieldError = createDynamicComponent<FieldErrorProps>(
  "field",
  "FieldError",
  _FieldError,
  {},
);

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
