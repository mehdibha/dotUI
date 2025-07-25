import React from "react";
import { DropZone, DropZoneLabel } from "@/components/dynamic-ui/drop-zone";
import { UploadIcon } from "lucide-react";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <DropZone aria-label="drag and drop files here">
        <UploadIcon className="text-fg-muted size-5" />
      </DropZone>
      <DropZone>
        <UploadIcon className="text-fg-muted size-5" />
        <DropZoneLabel>Drag and drop files here</DropZoneLabel>
      </DropZone>
    </div>
  );
}
