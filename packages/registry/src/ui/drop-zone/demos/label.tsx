import React from "react";

import { UploadIcon } from "@dotui/registry/icons";
import { DropZone, DropZoneLabel } from "@dotui/registry/ui/drop-zone";

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
