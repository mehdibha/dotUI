"use client";

import React from "react";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import * as Default from "./basic";
import type { ButtonProps, LinkButtonProps } from "./types";

export const Button = createDynamicComponent<ButtonProps>(
  "button",
  "Button",
  Default.Button,
  {
    ripple: React.lazy(() =>
      import("./ripple").then((mod) => ({ default: mod.Button })),
    ),
  },
);

export const LinkButton = createDynamicComponent<LinkButtonProps>(
  "link",
  "LinkButton",
  Default.LinkButton,
  {
    ripple: React.lazy(() =>
      import("./ripple").then((mod) => ({ default: mod.LinkButton })),
    ),
  },
);

export type { ButtonProps, LinkButtonProps };
