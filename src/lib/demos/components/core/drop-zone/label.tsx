"use client";

import React from "react";
import { DropZone, DropZoneLabel } from "@/lib/components/core/default/drop-zone";
import { UploadIcon } from "@/lib/icons";

export default function DropZoneDemo() {
  return (
    <div className="w-full space-y-2">
      <DropZone aria-label="drag and drop files here">
        <UploadIcon />
      </DropZone>
      <DropZone>
        <UploadIcon />
        <DropZoneLabel>Drag and drop files here</DropZoneLabel>
      </DropZone>
    </div>
  );
}
