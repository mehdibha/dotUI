"use client";

import React from "react";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import { Loader as _Loader } from "./basic";
import type { LoaderProps } from "./types";

export const Loader = createDynamicComponent<LoaderProps>(
  "loader",
  "Loader",
  _Loader,
  {
    ring: React.lazy(() =>
      import("./ring").then((mod) => ({ default: mod.Loader })),
    ),
  },
);

export type { LoaderProps };
