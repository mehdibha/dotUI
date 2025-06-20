import React from "react";
import { UploadIcon } from "lucide-react";

import { DropZone, DropZoneLabel } from "@dotui/ui/components/drop-zone";

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
