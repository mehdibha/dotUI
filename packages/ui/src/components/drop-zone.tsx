"use client";

import React from "react";

import { createDynamicComponent } from "../helpers/create-dynamic-component";
import {
  DropZone as _DropZone,
  DropZoneLabel as _DropZoneLabel,
} from "../registry/components/drop-zone/basic";
import type {
  DropZoneLabelProps,
  DropZoneProps,
} from "../registry/components/drop-zone/basic";

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
