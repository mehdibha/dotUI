"use client";

import React from "react";
import { LoaderProps } from "@/modules/registry/ui/loader.ring";
import { Loader as _Loader } from "@/modules/registry/ui/loader.ring";
import { createDynamicComponent } from "@/modules/styles/lib/create-dynamic-component";

export const Loader = createDynamicComponent<LoaderProps>(
  "loader",
  "Loader",
  _Loader,
  {
    "loader-dot-spinner": React.lazy(() =>
      import("@/modules/registry/ui/loader.dots").then((mod) => ({
        default: mod.Loader,
      }))
    ),
    "loader-line-spinner": React.lazy(() =>
      import("@/modules/registry/ui/loader.line").then((mod) => ({
        default: mod.Loader,
      }))
    ),
    "loader-ring": React.lazy(() =>
      import("@/modules/registry/ui/loader.ring").then((mod) => ({
        default: mod.Loader,
      }))
    ),
    "loader-tailspin": React.lazy(() =>
      import("@/modules/registry/ui/loader.tailspin").then((mod) => ({
        default: mod.Loader,
      }))
    ),
    "loader-wave": React.lazy(() =>
      import("@/modules/registry/ui/loader.wave").then((mod) => ({
        default: mod.Loader,
      }))
    ),
  }
);
