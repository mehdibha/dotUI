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
    import("@/registry/core/alert-01").then((mod) => ({
      default: mod.Alert,
    }))
  ),
  "alert-02": React.lazy(() =>
    import("@/registry/core/alert-02").then((mod) => ({
      default: mod.Alert,
    }))
  ),
  "alert-03": React.lazy(() =>
    import("@/registry/core/alert-03").then((mod) => ({
      default: mod.Alert,
    }))
  ),
  "alert-04": React.lazy(() =>
    import("@/registry/core/alert-04").then((mod) => ({
      default: mod.Alert,
    }))
  ),
  "alert-05": React.lazy(() =>
    import("@/registry/core/alert-05").then((mod) => ({
      default: mod.Alert,
    }))
  ),
});

export const AlertRoot = createDynamicComponent<AlertRootProps>(
  "alert",
  "AlertRoot",
  {
    "alert-01": React.lazy(() =>
      import("@/registry/core/alert-01").then((mod) => ({
        default: mod.AlertRoot,
      }))
    ),
    "alert-02": React.lazy(() =>
      import("@/registry/core/alert-02").then((mod) => ({
        default: mod.AlertRoot,
      }))
    ),
    "alert-03": React.lazy(() =>
      import("@/registry/core/alert-03").then((mod) => ({
        default: mod.AlertRoot,
      }))
    ),
    "alert-04": React.lazy(() =>
      import("@/registry/core/alert-04").then((mod) => ({
        default: mod.AlertRoot,
      }))
    ),
    "alert-05": React.lazy(() =>
      import("@/registry/core/alert-05").then((mod) => ({
        default: mod.AlertRoot,
      }))
    ),
  }
);

export const AlertTitle = createDynamicComponent<AlertTitleProps>(
  "alert",
  "AlertTitle",
  {
    "alert-01": React.lazy(() =>
      import("@/registry/core/alert-01").then((mod) => ({
        default: mod.AlertTitle,
      }))
    ),
    "alert-02": React.lazy(() =>
      import("@/registry/core/alert-02").then((mod) => ({
        default: mod.AlertTitle,
      }))
    ),
    "alert-03": React.lazy(() =>
      import("@/registry/core/alert-03").then((mod) => ({
        default: mod.AlertTitle,
      }))
    ),
    "alert-04": React.lazy(() =>
      import("@/registry/core/alert-04").then((mod) => ({
        default: mod.AlertTitle,
      }))
    ),
    "alert-05": React.lazy(() =>
      import("@/registry/core/alert-05").then((mod) => ({
        default: mod.AlertTitle,
      }))
    ),
  }
);
export const AlertContent = createDynamicComponent<AlertContentProps>(
  "alert",
  "AlertContent",
  {
    "alert-01": React.lazy(() =>
      import("@/registry/core/alert-01").then((mod) => ({
        default: mod.AlertContent,
      }))
    ),
    "alert-02": React.lazy(() =>
      import("@/registry/core/alert-02").then((mod) => ({
        default: mod.AlertContent,
      }))
    ),
    "alert-03": React.lazy(() =>
      import("@/registry/core/alert-03").then((mod) => ({
        default: mod.AlertContent,
      }))
    ),
    "alert-04": React.lazy(() =>
      import("@/registry/core/alert-04").then((mod) => ({
        default: mod.AlertContent,
      }))
    ),
    "alert-05": React.lazy(() =>
      import("@/registry/core/alert-05").then((mod) => ({
        default: mod.AlertContent,
      }))
    ),
  }
);
