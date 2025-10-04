"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  TextField as _TextField,
  TextFieldInput as _TextFieldInput,
  TextFieldRoot as _TextFieldRoot,
} from "./basic";
import type {
  TextFieldInputProps,
  TextFieldProps,
  TextFieldRootProps,
} from "./basic";

export const TextField = createDynamicComponent<TextFieldProps>(
  "text-field",
  "TextField",
  _TextField,
  {},
);

export const TextFieldRoot = createDynamicComponent<TextFieldRootProps>(
  "text-field",
  "TextFieldRoot",
  _TextFieldRoot,
  {},
);

export const TextFieldInput = createDynamicComponent<TextFieldInputProps>(
  "text-field",
  "TextFieldInput",
  _TextFieldInput,
  {},
);

export type { TextFieldProps, TextFieldRootProps, TextFieldInputProps };
