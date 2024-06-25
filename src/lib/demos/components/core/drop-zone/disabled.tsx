import React from "react";
import { DropZone, DropZoneLabel } from "@/lib/components/core/default/drop-zone";
import { UploadIcon } from "@/lib/icons";

export default function DropZoneDemo() {
  return (
    <DropZone isDisabled>
      <UploadIcon />
      <DropZoneLabel>Drag and drop files here</DropZoneLabel>
    </DropZone>
  );
}
