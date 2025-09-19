"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { Loader as _Loader } from "../registry/components/loader/ring";
import type { LoaderProps } from "../registry/components/loader/ring";

export const Loader = createDynamicComponent<LoaderProps>(
  "loader",
  "Loader",
  _Loader,
  {
    "ring-2": React.lazy(() =>
      import("../registry/components/loader/ring-2").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    dots: React.lazy(() =>
      import("../registry/components/loader/dots").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    line: React.lazy(() =>
      import("../registry/components/loader/line-spinner").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    tailspin: React.lazy(() =>
      import("../registry/components/loader/tailspin").then((mod) => ({
        default: mod.Loader,
      })),
    ),
    wave: React.lazy(() =>
      import("../registry/components/loader/wave").then((mod) => ({
        default: mod.Loader,
      })),
    ),
  },
);
