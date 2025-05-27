import React from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/dynamic-ui/button";
import { DropZone, DropZoneLabel } from "@/components/dynamic-ui/drop-zone";
import { FileTrigger } from "@/components/dynamic-ui/file-trigger";

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
