"use client";

import React from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { DropZone } from "@/lib/components/core/default/drop-zone";
import { FileTrigger } from "@/lib/components/core/default/file-trigger";

export default function DropZoneDemo() {
  const [dropped, setDropped] = React.useState(false);
  return (
    <DropZone
      label={dropped ? "Successful drop!" : "Drop files here"}
      description="Drag and drop files here to upload"
      onDrop={() => setDropped(true)}
    >
      <span className="text-fg-muted">Or</span>
      <FileTrigger>
        <Button prefix={<UploadIcon />}>Upload</Button>
      </FileTrigger>
    </DropZone>
  );
}
