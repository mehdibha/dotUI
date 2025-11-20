"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { ButtonProps, LinkButtonProps } from "./basic";
import {
  Button as _Button,
  ButtonProvider as _ButtonProvider,
  LinkButton as _LinkButton,
  buttonStyles,
} from "./basic";

export const Button = createDynamicComponent<ButtonProps>(
  "button",
  "Button",
  _Button,
  {},
);

export const LinkButton = createDynamicComponent<LinkButtonProps>(
  "link",
  "LinkButton",
  _LinkButton,
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
