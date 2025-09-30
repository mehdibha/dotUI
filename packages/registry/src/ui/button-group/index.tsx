"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import { ButtonGroup as _ButtonGroup } from "./basic";
import type { ButtonGroupProps } from "./basic";

export const ButtonGroup = createDynamicComponent<ButtonGroupProps>(
  "button-group",
  "ButtonGroup",
  _ButtonGroup,
  {},
);

export type { ButtonGroupProps };
