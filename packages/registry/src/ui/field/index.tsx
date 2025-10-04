"use client";

import React from "react";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  Description as _Description,
  FieldError as _FieldError,
  HelpText as _HelpText,
  Label as _Label,
} from "./basic";
import type {
  DescriptionProps,
  FieldErrorProps,
  FieldProps,
  HelpTextProps,
  LabelProps,
} from "./basic";

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

export const HelpText = createDynamicComponent<HelpTextProps>(
  "field",
  "HelpText",
  _HelpText,
  {},
);

export type {
  LabelProps,
  DescriptionProps,
  FieldErrorProps,
  HelpTextProps,
  FieldProps,
};
