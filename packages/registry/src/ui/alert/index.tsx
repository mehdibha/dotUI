"use client";

import React from "react";

import { createDynamicComponent } from "../../__internal__/helpers/create-dynamic-component";
import {
  Alert as _Alert,
  AlertContent as _AlertContent,
  AlertRoot as _AlertRoot,
  AlertTitle as _AlertTitle,
} from "./basic";
import type {
  AlertContentProps,
  AlertProps,
  AlertRootProps,
  AlertTitleProps,
} from "./basic";

export const Alert = createDynamicComponent<AlertProps>(
  "alert",
  "Alert",
  _Alert,
  {
    notch: React.lazy(() =>
      import("./notch").then((mod) => ({
        default: mod.Alert,
      })),
    ),
    "notch-2": React.lazy(() =>
      import("./notch-2").then((mod) => ({
        default: mod.Alert,
      })),
    ),
  },
);

export const AlertRoot = createDynamicComponent<AlertRootProps>(
  "alert",
  "AlertRoot",
  _AlertRoot,
  {
    notch: React.lazy(() =>
      import("./notch").then((mod) => ({
        default: mod.AlertRoot,
      })),
    ),
    "notch-2": React.lazy(() =>
      import("./notch-2").then((mod) => ({
        default: mod.AlertRoot,
      })),
    ),
  },
);

export const AlertTitle = createDynamicComponent<AlertTitleProps>(
  "alert",
  "AlertTitle",
  _AlertTitle,
  {
    notch: React.lazy(() =>
      import("./notch").then((mod) => ({
        default: mod.AlertTitle,
      })),
    ),
    "notch-2": React.lazy(() =>
      import("./notch-2").then((mod) => ({
        default: mod.AlertTitle,
      })),
    ),
  },
);

export const AlertContent = createDynamicComponent<AlertContentProps>(
  "alert",
  "AlertContent",
  _AlertContent,
  {
    notch: React.lazy(() =>
      import("./notch").then((mod) => ({
        default: mod.AlertContent,
      })),
    ),
    "notch-2": React.lazy(() =>
      import("./notch-2").then((mod) => ({
        default: mod.AlertContent,
      })),
    ),
  },
);

export type { AlertProps, AlertRootProps, AlertTitleProps, AlertContentProps };
