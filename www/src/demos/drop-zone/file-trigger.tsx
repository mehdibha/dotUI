import React from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import { DropZone, DropZoneLabel } from "@/components/dynamic-core/drop-zone";
import { FileTrigger } from "@/components/dynamic-core/file-trigger";

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
