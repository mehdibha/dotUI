"use client";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import { FileTrigger as _FileTrigger } from "../registry/components/file-trigger/basic";
import type { FileTriggerProps } from "../registry/components/file-trigger/basic";

export const FileTrigger = createDynamicComponent<FileTriggerProps>(
  "file-trigger",
  "FileTrigger",
  _FileTrigger,
  {},
);

export type { FileTriggerProps };
