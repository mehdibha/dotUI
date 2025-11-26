"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import * as Default from "./basic";
import type { TextFieldProps } from "./types";

export const TextField = createDynamicComponent<TextFieldProps>(
  "text-field",
  "TextField",
  Default.TextField,
  {},
);

export type { TextFieldProps };
