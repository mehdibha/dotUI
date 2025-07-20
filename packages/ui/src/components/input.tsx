"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Input as _Input,
  InputRoot as _InputRoot,
  TextAreaInput as _TextAreaInput,
  inputStyles,
} from "../registry/components/input/basic";
import type {
  InputProps,
  InputRootProps,
  TextAreaInputProps,
} from "../registry/components/input/basic";

export const Input = createDynamicComponent<InputProps>(
  "input",
  "Input",
  _Input,
  {
    basic: React.lazy(() =>
      import("../registry/components/input/basic").then((mod) => ({
        default: mod.Input,
      })),
    ),
  },
);

export const TextAreaInput = createDynamicComponent<TextAreaInputProps>(
  "input",
  "TextAreaInput",
  _TextAreaInput,
  {
    basic: React.lazy(() =>
      import("../registry/components/input/basic").then((mod) => ({
        default: mod.TextAreaInput,
      })),
    ),
  },
);

export const InputRoot = createDynamicComponent<InputRootProps>(
  "input",
  "InputRoot",
  _InputRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/input/basic").then((mod) => ({
        default: mod.InputRoot,
      })),
    ),
  },
);

export { inputStyles };
export type { InputProps, TextAreaInputProps, InputRootProps };
