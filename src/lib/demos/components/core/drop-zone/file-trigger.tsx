"use client";

import React from "react";
import { Button } from "@/lib/components/core/default/button";
import { DropZone, DropZoneLabel } from "@/lib/components/core/default/drop-zone";
import { FileTrigger } from "@/lib/components/core/default/file-trigger";
import { UploadIcon } from "@/lib/icons";

export default function DropZoneDemo() {
  return (
    <DropZone>
      <UploadIcon />
      <DropZoneLabel>Drag and drop files here</DropZoneLabel>
      <FileTrigger>
        <Button className="mt-2">Select files</Button>
      </FileTrigger>
    </DropZone>
  );
}
