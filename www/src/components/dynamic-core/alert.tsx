"use client";

import React from "react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import {
  Alert as _Alert,
  AlertRoot as _AlertRoot,
  AlertTitle as _AlertTitle,
  AlertContent as _AlertContent,
} from "@/registry/core/alert_basic";
import type {
  AlertProps,
  AlertRootProps,
  AlertTitleProps,
  AlertContentProps,
} from "@/registry/core/alert_basic";

export const Alert = createDynamicComponent<AlertProps>(
  "alert",
  "Alert",
  _Alert,
  {
    "alert-01": React.lazy(() =>
      import("@/registry/core/alert_basic").then((mod) => ({
        default: mod.Alert,
      }))
    ),
    "alert-02": React.lazy(() =>
      import("@/registry/core/alert_notch").then((mod) => ({
        default: mod.Alert,
      }))
    ),
    "alert-03": React.lazy(() =>
      import("@/registry/core/alert_notch-2").then((mod) => ({
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
    "alert-01": React.lazy(() =>
      import("@/registry/core/alert_basic").then((mod) => ({
        default: mod.AlertRoot,
      }))
    ),
    "alert-02": React.lazy(() =>
      import("@/registry/core/alert_notch").then((mod) => ({
        default: mod.AlertRoot,
      }))
    ),
    "alert-03": React.lazy(() =>
      import("@/registry/core/alert_notch-2").then((mod) => ({
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
    "alert-01": React.lazy(() =>
      import("@/registry/core/alert_basic").then((mod) => ({
        default: mod.AlertTitle,
      }))
    ),
    "alert-02": React.lazy(() =>
      import("@/registry/core/alert_notch").then((mod) => ({
        default: mod.AlertTitle,
      }))
    ),
    "alert-03": React.lazy(() =>
      import("@/registry/core/alert_notch-2").then((mod) => ({
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
    "alert-01": React.lazy(() =>
      import("@/registry/core/alert_basic").then((mod) => ({
        default: mod.AlertContent,
      }))
    ),
    "alert-02": React.lazy(() =>
      import("@/registry/core/alert_notch").then((mod) => ({
        default: mod.AlertContent,
      }))
    ),
    "alert-03": React.lazy(() =>
      import("@/registry/core/alert_notch-2").then((mod) => ({
        default: mod.AlertContent,
      }))
    ),
  }
);
