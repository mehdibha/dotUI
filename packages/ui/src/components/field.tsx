"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Description as _Description,
  FieldError as _FieldError,
  HelpText as _HelpText,
  Label as _Label,
} from "../registry/components/field/basic";
import type {
  DescriptionProps,
  FieldErrorProps,
  FieldProps,
  HelpTextProps,
  LabelProps,
} from "../registry/components/field/basic";

export const Label = createDynamicComponent<LabelProps>(
  "field",
  "Label",
  _Label,
  {
    basic: React.lazy(() =>
      import("../registry/components/field/basic").then((mod) => ({
        default: mod.Label,
      })),
    ),
  },
);

export const Description = createDynamicComponent<DescriptionProps>(
  "field",
  "Description",
  _Description,
  {
    basic: React.lazy(() =>
      import("../registry/components/field/basic").then((mod) => ({
        default: mod.Description,
      })),
    ),
  },
);

export const FieldError = createDynamicComponent<FieldErrorProps>(
  "field",
  "FieldError",
  _FieldError,
  {
    basic: React.lazy(() =>
      import("../registry/components/field/basic").then((mod) => ({
        default: mod.FieldError,
      })),
    ),
  },
);

export const HelpText = createDynamicComponent<HelpTextProps>(
  "field",
  "HelpText",
  _HelpText,
  {
    basic: React.lazy(() =>
      import("../registry/components/field/basic").then((mod) => ({
        default: mod.HelpText,
      })),
    ),
  },
);

export type {
  LabelProps,
  DescriptionProps,
  FieldErrorProps,
  HelpTextProps,
  FieldProps,
};
