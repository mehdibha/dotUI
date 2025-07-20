"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { ButtonGroup as _ButtonGroup } from "../registry/components/button-group/basic";
import type { ButtonGroupProps } from "../registry/components/button-group/basic";

export const ButtonGroup = createDynamicComponent<ButtonGroupProps>(
  "button-group",
  "ButtonGroup",
  _ButtonGroup,
  {
    basic: React.lazy(() =>
      import("../registry/components/button-group/basic").then((mod) => ({
        default: mod.ButtonGroup,
      })),
    ),
  },
);

export type { ButtonGroupProps };
