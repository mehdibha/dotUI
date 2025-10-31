"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { TextFieldProps } from "./basic";
import { TextField as _TextField } from "./basic";

export const TextField = createDynamicComponent<TextFieldProps>(
  "text-field",
  "TextField",
  _TextField,
  {},
);

export type { TextFieldProps };
