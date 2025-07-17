"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  Alert as _Alert,
  AlertContent as _AlertContent,
  AlertRoot as _AlertRoot,
  AlertTitle as _AlertTitle,
} from "../registry/components/alert/basic";
import type {
  AlertContentProps,
  AlertProps,
  AlertRootProps,
  AlertTitleProps,
} from "../registry/components/alert/basic";

export const Alert = createDynamicComponent<AlertProps>(
  "alert",
  "Alert",
  _Alert,
  {
    notch: React.lazy(() =>
      import("../registry/components/alert/notch").then((mod) => ({
        default: mod.Alert,
      })),
    ),
    "notch-2": React.lazy(() =>
      import("../registry/components/alert/notch-2").then((mod) => ({
        default: mod.Alert,
      })),
    ),
  },
  true,
);

export const AlertRoot = createDynamicComponent<AlertRootProps>(
  "alert",
  "AlertRoot",
  _AlertRoot,
  {
    notch: React.lazy(() =>
      import("../registry/components/alert/notch").then((mod) => ({
        default: mod.AlertRoot,
      })),
    ),
    "notch-2": React.lazy(() =>
      import("../registry/components/alert/notch-2").then((mod) => ({
        default: mod.AlertRoot,
      })),
    ),
  },
  true,
);

export const AlertTitle = createDynamicComponent<AlertTitleProps>(
  "alert",
  "AlertTitle",
  _AlertTitle,
  {
    notch: React.lazy(() =>
      import("../registry/components/alert/notch").then((mod) => ({
        default: mod.AlertTitle,
      })),
    ),
    "notch-2": React.lazy(() =>
      import("../registry/components/alert/notch-2").then((mod) => ({
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
      import("../registry/components/alert/notch").then((mod) => ({
        default: mod.AlertContent,
      })),
    ),
    "notch-2": React.lazy(() =>
      import("../registry/components/alert/notch-2").then((mod) => ({
        default: mod.AlertContent,
      })),
    ),
  },
);

export type { AlertProps, AlertRootProps, AlertTitleProps, AlertContentProps };
