"use client";

import { DropZone, DropZoneLabel } from "@dotui/registry/ui/drop-zone";

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
