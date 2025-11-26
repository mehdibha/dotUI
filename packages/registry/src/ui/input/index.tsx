"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import * as Default from "./basic";
import type {
  DateInputProps,
  DateSegmentProps,
  InputAddonProps,
  InputGroupProps,
  InputProps,
  TextAreaProps,
} from "./types";

export const Input = createDynamicComponent<InputProps>(
  "input",
  "Input",
  Default.Input,
  {},
);

export const TextArea = createDynamicComponent<TextAreaProps>(
  "input",
  "TextAreaInput",
  Default.TextArea,
  {},
);

export const InputGroup = createDynamicComponent<InputGroupProps>(
  "input",
  "InputGroup",
  Default.InputGroup,
  {},
);

export const InputAddon = createDynamicComponent<InputAddonProps>(
  "input",
  "InputAddon",
  Default.InputAddon,
  {},
);

export const DateInput = createDynamicComponent<DateInputProps>(
  "input",
  "DateInput",
  Default.DateInput,
  {},
);

export const DateSegment = createDynamicComponent<DateSegmentProps>(
  "input",
  "DateSegment",
  Default.DateSegment,
  {},
);

export type {
  DateInputProps,
  DateSegmentProps,
  InputAddonProps,
  InputGroupProps,
  InputProps,
  TextAreaProps,
};
