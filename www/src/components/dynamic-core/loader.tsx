"use client";

import React from "react";
import { createDynamicComponent } from "@/modules/themes/lib/create-dynamic-component";
import { LoaderProps } from "@/reg/ui/loader.ring";
import { Loader as _Loader } from "@/reg/ui/loader.ring";

export const Loader = createDynamicComponent<LoaderProps>(
  "loader",
  "Loader",
  _Loader,
  {
    "loader-dot-spinner": React.lazy(() =>
      import("@/reg/ui/loader.dots").then((mod) => ({
        default: mod.Loader,
      }))
    ),
    "loader-line-spinner": React.lazy(() =>
      import("@/reg/ui/loader.line").then((mod) => ({
        default: mod.Loader,
      }))
    ),
    "loader-ring": React.lazy(() =>
      import("@/reg/ui/loader.ring").then((mod) => ({
        default: mod.Loader,
      }))
    ),
    "loader-tailspin": React.lazy(() =>
      import("@/reg/ui/loader.tailspin").then((mod) => ({
        default: mod.Loader,
      }))
    ),
    "loader-wave": React.lazy(() =>
      import("@/reg/ui/loader.wave").then((mod) => ({
        default: mod.Loader,
      }))
    ),
  }
);
