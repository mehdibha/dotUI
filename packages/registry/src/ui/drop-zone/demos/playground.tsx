"use client";

import type { Control } from "@dotui/registry/playground";

import { DropZone, DropZoneLabel } from "../index";

interface DropZonePlaygroundProps {
  label?: string;
  isDisabled?: boolean;
}

export function DropZonePlayground({
  label = "Drop files here",
  isDisabled = false,
}: DropZonePlaygroundProps) {
  return (
    <DropZone isDisabled={isDisabled}>
      <DropZoneLabel>{label}</DropZoneLabel>
    </DropZone>
  );
}

export const dropZoneControls: Control[] = [
  {
    type: "string",
    name: "label",
    defaultValue: "Drop files here",
  },
  {
    type: "boolean",
    name: "isDisabled",
    defaultValue: false,
  },
];
