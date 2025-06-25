"use client";

import React from "react";

import type { LoaderProps } from "../__registry__/components/loader/ring";
import { Loader as _Loader } from "../__registry__/components/loader/ring";
import { createDynamicComponent } from "../internal/create-dynamic-component";

export const Loader = createDynamicComponent<LoaderProps>(
  "loader",
  "Loader",
  _Loader,
  {
    "loader-dot-spinner": React.lazy(() =>
      import("../__registry__/components/loader/dots").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    "loader-line-spinner": React.lazy(() =>
      import("../__registry__/components/loader/line").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    "loader-ring": React.lazy(() =>
      import("../__registry__/components/loader/ring").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    "loader-tailspin": React.lazy(() =>
      import("../__registry__/components/loader/tailspin").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    "loader-wave": React.lazy(() =>
      import("../__registry__/components/loader/wave").then((mod) => ({
        default: mod.Loader,
      })),
    ),
  },
);
