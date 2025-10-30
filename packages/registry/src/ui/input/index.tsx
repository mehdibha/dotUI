"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type {
  DateInputProps,
  DateSegmentProps,
  InputAddonProps,
  InputGroupProps,
  InputProps,
  TextAreaProps,
} from "./basic";
import {
  DateInput as _DateInput,
  DateSegment as _DateSegment,
  Input as _Input,
  InputAddon as _InputAddon,
  InputGroup as _InputGroup,
  TextArea as _TextArea,
} from "./basic";

export const Input = createDynamicComponent<InputProps>(
  "input",
  "Input",
  _Input,
  {},
);

export const TextArea = createDynamicComponent<TextAreaProps>(
  "input",
  "TextAreaInput",
  _TextArea,
  {},
);

export const InputGroup = createDynamicComponent<InputGroupProps>(
  "input",
  "InputGroup",
  _InputGroup,
  {},
);

export const InputAddon = createDynamicComponent<InputAddonProps>(
  "input",
  "InputAddon",
  _InputAddon,
  {},
);

export const DateInput = createDynamicComponent<DateInputProps>(
  "input",
  "DateInput",
  _DateInput,
  {},
);

export const DateSegment = createDynamicComponent<DateSegmentProps>(
  "input",
  "DateSegment",
  _DateSegment,
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
