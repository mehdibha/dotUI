"use client";

import React from "react";
import { LoaderProps } from "@/registry/core/loader_ring";
import { Loader as _Loader } from "@/registry/core/loader_ring";
import { createDynamicComponent } from "@/modules/themes/lib/create-dynamic-component";

export const Loader = createDynamicComponent<LoaderProps>(
  "loader",
  "Loader",
  _Loader,
  {
    "loader-dot-spinner": React.lazy(() =>
      import("@/registry/core/loader_dots").then((mod) => ({
        default: mod.Loader,
      }))
    ),
    "loader-line-spinner": React.lazy(() =>
      import("@/registry/core/loader_line").then((mod) => ({
        default: mod.Loader,
      }))
    ),
    "loader-ring": React.lazy(() =>
      import("@/registry/core/loader_ring").then((mod) => ({
        default: mod.Loader,
      }))
    ),
    "loader-tailspin": React.lazy(() =>
      import("@/registry/core/loader_tailspin").then((mod) => ({
        default: mod.Loader,
      }))
    ),
    "loader-wave": React.lazy(() =>
      import("@/registry/core/loader_wave").then((mod) => ({
        default: mod.Loader,
      }))
    ),
  }
);
