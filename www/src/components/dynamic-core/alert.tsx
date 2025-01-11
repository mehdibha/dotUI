"use client";

import React from "react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import type {
  AlertProps,
  AlertRootProps,
  AlertTitleProps,
  AlertContentProps,
} from "@/registry/core/alert-01";

export const Alert = createDynamicComponent<AlertProps>("alert", "Alert", {
  "alert-01": React.lazy(() =>
    import("@/__registry__/core/alert-01").then((mod) => ({
      default: mod.Alert,
    }))
  ),
});

export const AlertRoot = createDynamicComponent<AlertRootProps>(
  "alert",
  "AlertRoot",
  {
    "alert-01": React.lazy(() =>
      import("@/__registry__/core/alert-01").then((mod) => ({
        default: mod.Alert,
      }))
    ),
  }
);

export const AlertTitle = createDynamicComponent<AlertTitleProps>(
  "alert",
  "AlertTitle",
  {
    "alert-01": React.lazy(() =>
      import("@/__registry__/core/alert-01").then((mod) => ({
        default: mod.Alert,
      }))
    ),
  }
);
export const AlertContent = createDynamicComponent<AlertContentProps>(
  "alert",
  "AlertContent",
  {
    "alert-01": React.lazy(() =>
      import("@/__registry__/core/alert-01").then((mod) => ({
        default: mod.Alert,
      }))
    ),
  }
);
