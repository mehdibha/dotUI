"use client";

import React from "react";

import { createDynamicComponent } from "../internal/create-dynamic-component";
import { Loader as _Loader } from "../registry/components/loader/ring";
import type { LoaderProps } from "../registry/components/loader/ring";

export const Loader = createDynamicComponent<LoaderProps>(
  "loader",
  "Loader",
  _Loader,
  {
    "loader-dot-spinner": React.lazy(() =>
      import("../registry/components/loader/dots").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    "loader-line-spinner": React.lazy(() =>
      import("../registry/components/loader/line").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    "loader-ring": React.lazy(() =>
      import("../registry/components/loader/ring").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    "loader-tailspin": React.lazy(() =>
      import("../registry/components/loader/tailspin").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    "loader-wave": React.lazy(() =>
      import("../registry/components/loader/wave").then((mod) => ({
        default: mod.Loader,
      })),
    ),
  },
);
