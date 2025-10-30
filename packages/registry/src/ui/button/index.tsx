"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { ButtonProps } from "./basic";
import {
  Button as _Button,
  ButtonProvider as _ButtonProvider,
  buttonStyles,
} from "./basic";

export const Button = createDynamicComponent<ButtonProps>(
  "button",
  "Button",
  _Button,
  {},
);

export const ButtonProvider = createDynamicComponent(
  "button",
  "ButtonProvider",
  _ButtonProvider,
  {},
);

export { buttonStyles };
export type { ButtonProps };
