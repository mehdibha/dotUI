import React from "react";
import { UploadIcon } from "lucide-react";
import { DropZone, DropZoneLabel } from "@/lib/components/core/default/drop-zone";

export default function DropZoneDemo() {
  return (
    <DropZone isDisabled>
      <UploadIcon />
      <DropZoneLabel>Drag and drop files here</DropZoneLabel>
    </DropZone>
  );
}
