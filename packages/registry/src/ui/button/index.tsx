"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type { ButtonProps, LinkButtonProps } from "./types";

export const Button = createDynamicComponent<ButtonProps>("button", "Button", Default.Button, {});

export const LinkButton = createDynamicComponent<LinkButtonProps>("link", "LinkButton", Default.LinkButton, {});

export type { ButtonProps, LinkButtonProps };
