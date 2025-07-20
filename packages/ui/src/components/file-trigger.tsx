"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { FileTrigger as _FileTrigger } from "../registry/components/file-trigger/basic";
import type { FileTriggerProps } from "../registry/components/file-trigger/basic";

export const FileTrigger = createDynamicComponent<FileTriggerProps>(
  "file-trigger",
  "FileTrigger",
  _FileTrigger,
  {
    basic: React.lazy(() =>
      import("../registry/components/file-trigger/basic").then((mod) => ({
        default: mod.FileTrigger,
      })),
    ),
  },
);

export type { FileTriggerProps };
