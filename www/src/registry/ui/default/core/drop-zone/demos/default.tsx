import React from "react";
import { DropZone } from "@/registry/ui/default/core/drop-zone";
import { UploadIcon } from "@/__icons__";

export default function Demo() {
  return (
    <DropZone>
      <UploadIcon />
    </DropZone>
  );
}
