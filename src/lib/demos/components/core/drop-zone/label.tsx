"use client";

import React from "react";
import { UploadIcon } from "lucide-react";
import { DropZone, DropZoneLabel } from "@/lib/components/core/default/drop-zone";

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
