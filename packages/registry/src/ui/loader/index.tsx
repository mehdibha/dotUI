"use client";

import React from "react";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { LoaderProps } from "./basic";
import { Loader as _Loader } from "./basic";

export const Loader = createDynamicComponent<LoaderProps>(
  "loader",
  "Loader",
  _Loader,
  {
    // Future variants will be added here
  },
);

export type { LoaderProps };
