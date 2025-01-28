import React from "react";
import { UploadIcon } from "lucide-react";
import { DropZone } from "@/components/dynamic-core/drop-zone";

export default function Demo() {
  return (
    <DropZone>
      <UploadIcon className="text-fg-muted size-5" />
    </DropZone>
  );
}
