import React from "react";
import { UploadIcon } from "lucide-react";

import { DropZone, DropZoneLabel } from "@dotui/ui/components/drop-zone";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <DropZone aria-label="drag and drop files here">
        <UploadIcon className="size-5 text-fg-muted" />
      </DropZone>
      <DropZone>
        <UploadIcon className="size-5 text-fg-muted" />
        <DropZoneLabel>Drag and drop files here</DropZoneLabel>
      </DropZone>
    </div>
  );
}
