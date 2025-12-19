"use client";

import { createDynamicComponent } from "@dotui/core/components/create-dynamic-component";

import * as Default from "./basic";
import type { FileTriggerProps } from "./types";

export const FileTrigger = createDynamicComponent<FileTriggerProps>(
	"file-trigger",
	"FileTrigger",
	Default.FileTrigger,
	{},
);

export type { FileTriggerProps };
