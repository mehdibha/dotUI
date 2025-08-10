"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  TextField as _TextField,
  TextFieldInput as _TextFieldInput,
  TextFieldRoot as _TextFieldRoot,
} from "../registry/components/text-field/basic";
import type {
  TextFieldInputProps,
  TextFieldProps,
  TextFieldRootProps,
} from "../registry/components/text-field/basic";

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
