import React from "react";
import { DropZone, DropZoneLabel } from "@/components/dynamic-ui/drop-zone";
import { UploadIcon } from "lucide-react";

export default function Demo() {
  return (
    <DropZone isDisabled>
      <UploadIcon className="size-5" />
      <DropZoneLabel>Drag and drop files here</DropZoneLabel>
    </DropZone>
  );
}
