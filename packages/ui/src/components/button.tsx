"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Button as _Button,
  ButtonProvider as _ButtonProvider,
  buttonStyles,
} from "../registry/components/button/basic";
import type { ButtonProps } from "../registry/components/button/basic";

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
