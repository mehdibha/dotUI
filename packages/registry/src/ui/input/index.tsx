"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  Input as _Input,
  InputRoot as _InputRoot,
  TextAreaInput as _TextAreaInput,
  inputStyles,
} from "./basic";
import type { InputProps, InputRootProps, TextAreaInputProps } from "./basic";

export const Input = createDynamicComponent<InputProps>(
  "input",
  "Input",
  _Input,
  {},
);

export const TextAreaInput = createDynamicComponent<TextAreaInputProps>(
  "input",
  "TextAreaInput",
  _TextAreaInput,
  {},
);

export const InputRoot = createDynamicComponent<InputRootProps>(
  "input",
  "InputRoot",
  _InputRoot,
  {},
);

export { inputStyles };
export type { InputProps, TextAreaInputProps, InputRootProps };
