"use client";

import type { LoaderProps } from "@/__registry__/ui/loader.ring";
import React from "react";
import { Loader as _Loader } from "@/__registry__/ui/loader.ring";
import { createDynamicComponent } from "@/modules/styles/lib/create-dynamic-component";

export const Loader = createDynamicComponent<LoaderProps>(
  "loader",
  "Loader",
  _Loader,
  {
    "loader-dot-spinner": React.lazy(() =>
      import("@/__registry__/ui/loader.dots").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    "loader-line-spinner": React.lazy(() =>
      import("@/__registry__/ui/loader.line").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    "loader-ring": React.lazy(() =>
      import("@/__registry__/ui/loader.ring").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    "loader-tailspin": React.lazy(() =>
      import("@/__registry__/ui/loader.tailspin").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    "loader-wave": React.lazy(() =>
      import("@/__registry__/ui/loader.wave").then((mod) => ({
        default: mod.Loader,
      })),
    ),
  },
);
