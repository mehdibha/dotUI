import React from "react";
import { UploadIcon } from "lucide-react";

import { DropZone, DropZoneLabel } from "@dotui/ui/components/drop-zone";

export default function Demo() {
  return (
    <DropZone isDisabled>
      <UploadIcon className="size-5" />
      <DropZoneLabel>Drag and drop files here</DropZoneLabel>
    </DropZone>
  );
}
