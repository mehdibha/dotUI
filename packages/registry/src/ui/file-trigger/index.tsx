"use client";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import { FileTrigger as _FileTrigger } from "./basic";
import type { FileTriggerProps } from "./basic";

export const FileTrigger = createDynamicComponent<FileTriggerProps>(
  "file-trigger",
  "FileTrigger",
  _FileTrigger,
  {},
);

export type { FileTriggerProps };
