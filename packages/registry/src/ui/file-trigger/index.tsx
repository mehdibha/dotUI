"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import * as Default from "./basic";
import type { FileTriggerProps } from "./types";

export const FileTrigger = createDynamicComponent<FileTriggerProps>(
  "file-trigger",
  "FileTrigger",
  Default.FileTrigger,
  {},
);

export type { FileTriggerProps };
