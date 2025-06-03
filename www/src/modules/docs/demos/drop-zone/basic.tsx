import React from "react";
import { DropZone } from "@/components/dynamic-ui/drop-zone";
import { UploadIcon } from "lucide-react";

export default function Demo() {
  return (
    <DropZone>
      <UploadIcon className="text-fg-muted size-5" />
    </DropZone>
  );
}
