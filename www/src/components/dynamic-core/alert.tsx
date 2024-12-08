"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2Icon } from "lucide-react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import type {
  AlertProps,
  AlertRootProps,
  AlertTitleProps,
  AlertContentProps,
} from "@/registry/core/alert-01";

export const Alert = createDynamicComponent<AlertProps>("alert", "Alert", {
  "alert-01": dynamic(
    () => import("@/__registry__/core/alert-01").then((mod) => mod.Alert),
    {
      loading: () => <Loader2Icon className="size-6 animate-spin" />,
      ssr: false,
    }
  ),
});

export const AlertRoot = createDynamicComponent<AlertRootProps>(
  "alert",
  "AlertRoot",
  {
    "alert-01": dynamic(
      () => import("@/__registry__/core/alert-01").then((mod) => mod.AlertRoot),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);

export const AlertTitle = createDynamicComponent<AlertTitleProps>(
  "alert",
  "AlertTitle",
  {
    "alert-01": dynamic(
      () =>
        import("@/__registry__/core/alert-01").then((mod) => mod.AlertTitle),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);

export const AlertContent = createDynamicComponent<AlertContentProps>(
  "alert",
  "AlertContent",
  {
    "alert-01": dynamic(
      () =>
        import("@/__registry__/core/alert-01").then((mod) => mod.AlertContent),
      {
        loading: () => <Loader2Icon className="size-6 animate-spin" />,
        ssr: false,
      }
    ),
  }
);
