"use client";

import React from "react";
import { createDynamicComponent } from "@/modules/themes/lib/create-dynamic-component";
import type {
  AlertProps,
  AlertRootProps,
  AlertTitleProps,
  AlertContentProps,
} from "@/reg/ui/alert.basic";
import {
  Alert as _Alert,
  AlertRoot as _AlertRoot,
  AlertTitle as _AlertTitle,
  AlertContent as _AlertContent,
} from "@/reg/ui/alert.basic";

export const Alert = createDynamicComponent<AlertProps>(
  "alert",
  "Alert",
  _Alert,
  {
    basic: React.lazy(() =>
      import("@/reg/ui/alert.basic").then((mod) => ({
        default: mod.Alert,
      }))
    ),
    notch: React.lazy(() =>
      import("@/reg/ui/alert.notch").then((mod) => ({
        default: mod.Alert,
      }))
    ),
    "notch-2": React.lazy(() =>
      import("@/reg/ui/alert.notch-2").then((mod) => ({
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
    basic: React.lazy(() =>
      import("@/reg/ui/alert.basic").then((mod) => ({
        default: mod.AlertRoot,
      }))
    ),
    notch: React.lazy(() =>
      import("@/reg/ui/alert.notch").then((mod) => ({
        default: mod.AlertRoot,
      }))
    ),
    "notch-2": React.lazy(() =>
      import("@/reg/ui/alert.notch-2").then((mod) => ({
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
    basic: React.lazy(() =>
      import("@/reg/ui/alert.basic").then((mod) => ({
        default: mod.AlertTitle,
      }))
    ),
    notch: React.lazy(() =>
      import("@/reg/ui/alert.notch").then((mod) => ({
        default: mod.AlertTitle,
      }))
    ),
    "notch-2": React.lazy(() =>
      import("@/reg/ui/alert.notch-2").then((mod) => ({
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
    basic: React.lazy(() =>
      import("@/reg/ui/alert.basic").then((mod) => ({
        default: mod.AlertContent,
      }))
    ),
    notch: React.lazy(() =>
      import("@/reg/ui/alert.notch").then((mod) => ({
        default: mod.AlertContent,
      }))
    ),
    "notch-2": React.lazy(() =>
      import("@/reg/ui/alert.notch-2").then((mod) => ({
        default: mod.AlertContent,
      }))
    ),
  }
);
