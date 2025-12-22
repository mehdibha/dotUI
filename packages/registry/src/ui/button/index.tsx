"use client";

import React from "react";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type { ButtonProps, LinkButtonProps } from "./types";
import { createLink } from "@tanstack/react-router";

export const Button = createDynamicComponent<ButtonProps>("button", "Button", Default.Button, {
	ripple: React.lazy(() => import("./ripple").then((mod) => ({ default: mod.Button }))),
});

const LinkButtonBase = createDynamicComponent<LinkButtonProps>("link", "LinkButton", Default.LinkButton, {
	ripple: React.lazy(() => import("./ripple").then((mod) => ({ default: mod.LinkButton }))),
});
export const LinkButton = createLink(LinkButtonBase);


export type { ButtonProps, LinkButtonProps };