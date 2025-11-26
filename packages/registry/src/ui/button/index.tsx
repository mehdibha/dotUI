"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import * as Default from "./basic";
import type { ButtonProps, LinkButtonProps } from "./types";

export const Button = createDynamicComponent<ButtonProps>(
  "button",
  "Button",
  Default.Button,
  {},
);

export const LinkButton = createDynamicComponent<LinkButtonProps>(
  "link",
  "LinkButton",
  Default.LinkButton,
  {},
);

export const ButtonProvider = createDynamicComponent(
  "button",
  "ButtonProvider",
  Default.ButtonProvider,
  {},
);

export { buttonStyles } from "./basic";
export type { ButtonProps, LinkButtonProps };
