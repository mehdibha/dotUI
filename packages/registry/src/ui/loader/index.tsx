"use client";

import React from "react";

import { createDynamicComponent } from "@dotui/registry/ui/create-dynamic-component";

import * as Default from "./basic";
import type { LoaderProps } from "./types";

export const Loader = createDynamicComponent<LoaderProps>(
  "loader",
  "Loader",
  Default.Loader,
  {
    ring: React.lazy(() =>
      import("./ring").then((mod) => ({ default: mod.Loader })),
    ),
  },
);

export type { LoaderProps };
