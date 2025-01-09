export * from "@/registry/core/link";

"use client";

import React from "react";
import { createDynamicComponent } from "@/lib/create-dynamic-component";
import { LoaderProps } from "@/registry/core/loader-ring";

export const Loader = createDynamicComponent<LoaderProps>("loader", "Loader", {
  "loader-dot-spinner": React.lazy(() =>
    import("@/registry/core/loader-dot-spinner").then((mod) => ({
      default: mod.Loader,
    }))
  ),
  "loader-line-spinner": React.lazy(() =>
    import("@/registry/core/loader-line-spinner").then((mod) => ({
      default: mod.Loader,
    }))
  ),
  "loader-ring": React.lazy(() =>
    import("@/registry/core/loader-ring").then((mod) => ({
      default: mod.Loader,
    }))
  ),
  "loader-tailspin": React.lazy(() =>
    import("@/registry/core/loader-tailspin").then((mod) => ({
      default: mod.Loader,
    }))
  ),
  "loader-wave": React.lazy(() =>
    import("@/registry/core/loader-wave").then((mod) => ({
      default: mod.Loader,
    }))
  ),
});
