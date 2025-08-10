import React from "react";

import { Button } from "@dotui/ui/components/button";
import { DropZone, DropZoneLabel } from "@dotui/ui/components/drop-zone";
import { FileTrigger } from "@dotui/ui/components/file-trigger";
import { UploadIcon } from "@dotui/ui/icons";

export default function Demo() {
  return (
    <DropZone className="space-y-1">
      <UploadIcon className="text-fg-muted size-5" />
      <DropZoneLabel>Drag and drop files here</DropZoneLabel>
      <FileTrigger>
        <Button>Select files</Button>
      </FileTrigger>
    </DropZone>
  );
}
