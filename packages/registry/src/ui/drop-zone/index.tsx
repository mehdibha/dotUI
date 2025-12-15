"use client";

import { createDynamicComponent } from "@dotui/core/utils/create-dynamic-component";

import * as Default from "./basic";
import type { DropZoneLabelProps, DropZoneProps } from "./types";

export const DropZone = createDynamicComponent<DropZoneProps>("drop-zone", "DropZone", Default.DropZone, {});

export const DropZoneLabel = createDynamicComponent<DropZoneLabelProps>(
	"drop-zone",
	"DropZoneLabel",
	Default.DropZoneLabel,
	{},
);

export type { DropZoneProps, DropZoneLabelProps };
