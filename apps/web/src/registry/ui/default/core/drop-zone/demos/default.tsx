import React from "react";
import { UploadIcon } from "@/lib/icons";
import { DropZone } from "@/registry/ui/default/core/drop-zone";

export default function Demo() {
  return (
    <DropZone>
      <UploadIcon />
    </DropZone>
  );
}
