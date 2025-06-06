"use client";

import React from "react";
import type {
  AlertProps,
  AlertRootProps,
  AlertTitleProps,
  AlertContentProps,
} from "@/__registry__/ui/alert.basic";
import {
  Alert as _Alert,
  AlertRoot as _AlertRoot,
  AlertTitle as _AlertTitle,
  AlertContent as _AlertContent,
} from "@/__registry__/ui/alert.basic";
import { createDynamicComponent } from "@/modules/styles/lib/create-dynamic-component";

export const Alert = createDynamicComponent<AlertProps>(
  "alert",
  "Alert",
  _Alert,
  {
    notch: React.lazy(() =>
      import("@/__registry__/ui/alert.notch").then((mod) => ({
        default: mod.Alert,
      }))
    ),
    "notch-2": React.lazy(() =>
      import("@/__registry__/ui/alert.notch-2").then((mod) => ({
        default: mod.Alert,
      }))
    ),
  }
);

export const AlertRoot = createDynamicComponent<AlertRootProps>(
  "alert",
  "AlertRoot",
  _AlertRoot,
  {
    notch: React.lazy(() =>
      import("@/__registry__/ui/alert.notch").then((mod) => ({
        default: mod.AlertRoot,
      }))
    ),
    "notch-2": React.lazy(() =>
      import("@/__registry__/ui/alert.notch-2").then((mod) => ({
        default: mod.AlertRoot,
      }))
    ),
  }
);

export const AlertTitle = createDynamicComponent<AlertTitleProps>(
  "alert",
  "AlertTitle",
  _AlertTitle,
  {
    notch: React.lazy(() =>
      import("@/__registry__/ui/alert.notch").then((mod) => ({
        default: mod.AlertTitle,
      }))
    ),
    "notch-2": React.lazy(() =>
      import("@/__registry__/ui/alert.notch-2").then((mod) => ({
        default: mod.AlertTitle,
      }))
    ),
  }
);
export const AlertContent = createDynamicComponent<AlertContentProps>(
  "alert",
  "AlertContent",
  _AlertContent,
  {
    notch: React.lazy(() =>
      import("@/__registry__/ui/alert.notch").then((mod) => ({
        default: mod.AlertContent,
      }))
    ),
    "notch-2": React.lazy(() =>
      import("@/__registry__/ui/alert.notch-2").then((mod) => ({
        default: mod.AlertContent,
      }))
    ),
  }
);
