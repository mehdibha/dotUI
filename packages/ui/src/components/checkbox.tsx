"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Checkbox as _Checkbox,
  CheckboxIndicator as _CheckboxIndicator,
  CheckboxProvider as _CheckboxProvider,
  CheckboxRoot as _CheckboxRoot,
  checkboxStyles,
} from "../registry/components/checkbox/basic";
import type {
  CheckboxIndicatorProps,
  CheckboxProps,
  CheckboxRootProps,
} from "../registry/components/checkbox/basic";

export const Checkbox = createDynamicComponent<CheckboxProps>(
  "checkbox",
  "Checkbox",
  _Checkbox,
  {
    basic: React.lazy(() =>
      import("../registry/components/checkbox/basic").then((mod) => ({
        default: mod.Checkbox,
      })),
    ),
  },
);

export const CheckboxRoot = createDynamicComponent<CheckboxRootProps>(
  "checkbox",
  "CheckboxRoot",
  _CheckboxRoot,
  {
    basic: React.lazy(() =>
      import("../registry/components/checkbox/basic").then((mod) => ({
        default: mod.CheckboxRoot,
      })),
    ),
  },
);

export const CheckboxIndicator = createDynamicComponent<CheckboxIndicatorProps>(
  "checkbox",
  "CheckboxIndicator",
  _CheckboxIndicator,
  {
    basic: React.lazy(() =>
      import("../registry/components/checkbox/basic").then((mod) => ({
        default: mod.CheckboxIndicator,
      })),
    ),
  },
);

export const CheckboxProvider = createDynamicComponent(
  "checkbox",
  "CheckboxProvider",
  _CheckboxProvider,
  {
    basic: React.lazy(() =>
      import("../registry/components/checkbox/basic").then((mod) => ({
        default: mod.CheckboxProvider,
      })),
    ),
  },
);

export { checkboxStyles };
export type { CheckboxProps, CheckboxRootProps, CheckboxIndicatorProps };
