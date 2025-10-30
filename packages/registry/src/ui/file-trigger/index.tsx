"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { FileTriggerProps } from "./basic";
import { FileTrigger as _FileTrigger } from "./basic";

export const FileTrigger = createDynamicComponent<FileTriggerProps>(
  "file-trigger",
  "FileTrigger",
  _FileTrigger,
  {},
);

export type { FileTriggerProps };
