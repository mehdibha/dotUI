"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./base";
import type { FileTriggerProps } from "./types";

export const FileTrigger = createDynamicComponent<FileTriggerProps>(
	"file-trigger",
	"FileTrigger",
	Default.FileTrigger,
	{},
);

export type { FileTriggerProps };
