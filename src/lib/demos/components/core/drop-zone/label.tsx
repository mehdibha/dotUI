"use client";

import React from "react";
import { UploadIcon } from "lucide-react";
import { DropZone, DropZoneLabel } from "@/lib/components/core/default/drop-zone";

export default function DropZoneDemo() {
  return (
    <div className="space-y-2 w-full">
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
