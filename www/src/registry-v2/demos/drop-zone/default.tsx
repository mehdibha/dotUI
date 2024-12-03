import React from "react";
import { DropZone } from "@/components/dynamic-core/drop-zone";
import { UploadIcon } from "@/__icons__";

export default function Demo() {
  return (
    <DropZone>
      <UploadIcon />
    </DropZone>
  );
}
