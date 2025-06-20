"use client";

import React from "react";

import type {
  AlertContentProps,
  AlertProps,
  AlertRootProps,
  AlertTitleProps,
} from "@dotui/ui/__registry__/components/alert/basic";
import {
  Alert as _Alert,
  AlertContent as _AlertContent,
  AlertRoot as _AlertRoot,
  AlertTitle as _AlertTitle,
} from "@dotui/ui/__registry__/components/alert/basic";
import { createDynamicComponent } from "@dotui/ui/internal/create-dynamic-component";

export const Alert = createDynamicComponent<AlertProps>(
  "alert",
  "Alert",
  _Alert,
  {
    basic: React.lazy(() =>
      import("@dotui/ui/__registry__/components/alert/basic").then((mod) => ({
        default: mod.Alert,
      })),
    ),
    notch: React.lazy(() =>
      import("@dotui/ui/__registry__/components/alert/notch").then((mod) => ({
        default: mod.Alert,
      })),
    ),
    "notch-2": React.lazy(() =>
      import("@dotui/ui/__registry__/components/alert/notch-2").then((mod) => ({
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
    basic: React.lazy(() =>
      import("@dotui/ui/__registry__/components/alert/basic").then((mod) => ({
        default: mod.AlertRoot,
      })),
    ),
    notch: React.lazy(() =>
      import("@dotui/ui/__registry__/components/alert/notch").then((mod) => ({
        default: mod.AlertRoot,
      })),
    ),
    "notch-2": React.lazy(() =>
      import("@dotui/ui/__registry__/components/alert/notch-2").then((mod) => ({
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
    basic: React.lazy(() =>
      import("@dotui/ui/__registry__/components/alert/basic").then((mod) => ({
        default: mod.AlertTitle,
      })),
    ),
    notch: React.lazy(() =>
      import("@dotui/ui/__registry__/components/alert/notch").then((mod) => ({
        default: mod.AlertTitle,
      })),
    ),
    "notch-2": React.lazy(() =>
      import("@dotui/ui/__registry__/components/alert/notch-2").then((mod) => ({
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
    basic: React.lazy(() =>
      import("@dotui/ui/__registry__/components/alert/basic").then((mod) => ({
        default: mod.AlertContent,
      })),
    ),
    notch: React.lazy(() =>
      import("@dotui/ui/__registry__/components/alert/notch").then((mod) => ({
        default: mod.AlertContent,
      })),
    ),
    "notch-2": React.lazy(() =>
      import("@dotui/ui/__registry__/components/alert/notch-2").then((mod) => ({
        default: mod.AlertContent,
      })),
    ),
  },
);

export type { AlertProps, AlertRootProps, AlertTitleProps, AlertContentProps };
