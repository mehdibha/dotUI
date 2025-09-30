"use client";

import React from "react";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import { Loader as _Loader } from "./ring";
import type { LoaderProps } from "./ring";

export const Loader = createDynamicComponent<LoaderProps>(
  "loader",
  "Loader",
  _Loader,
  {
    "ring-2": React.lazy(() =>
      import("./ring-2").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    dots: React.lazy(() =>
      import("./dots").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    line: React.lazy(() =>
      import("./line-spinner").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    tailspin: React.lazy(() =>
      import("./tailspin").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    wave: React.lazy(() =>
      import("./wave").then((mod) => ({
        default: mod.Loader,
      })),
    ),
  },
);
