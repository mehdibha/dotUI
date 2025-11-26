"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { TextField as _TextField } from "./basic";
import type { TextFieldProps } from "./types";

export const TextField = createDynamicComponent<TextFieldProps>(
  "text-field",
  "TextField",
  _TextField,
  {},
);

export type { TextFieldProps };
