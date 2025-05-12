import React from "react";
import { UploadIcon } from "lucide-react";
import { DropZone, DropZoneLabel } from "@/components/dynamic-ui/drop-zone";

export default function Demo() {
  return (
    <DropZone isDisabled>
      <UploadIcon className="size-5" />
      <DropZoneLabel>Drag and drop files here</DropZoneLabel>
    </DropZone>
  );
}
