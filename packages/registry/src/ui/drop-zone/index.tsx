"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import {
  DropZone as _DropZone,
  DropZoneLabel as _DropZoneLabel,
} from "./basic";
import type { DropZoneLabelProps, DropZoneProps } from "./basic";

export const DropZone = createDynamicComponent<DropZoneProps>(
  "drop-zone",
  "DropZone",
  _DropZone,
  {},
);

export const DropZoneLabel = createDynamicComponent<DropZoneLabelProps>(
  "drop-zone",
  "DropZoneLabel",
  _DropZoneLabel,
  {},
);

export type { DropZoneProps, DropZoneLabelProps };
