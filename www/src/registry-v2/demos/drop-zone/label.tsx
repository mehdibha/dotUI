"use client";

import React from "react";
import { DropZone } from "@/components/dynamic-core/drop-zone";
import { Text } from "@/components/dynamic-core/text";
import { UploadIcon } from "@/__icons__";

export default function Demo() {
  return (
    <div className="flex flex-col gap-4">
      <DropZone aria-label="drag and drop files here">
        <UploadIcon />
      </DropZone>
      <DropZone>
        <UploadIcon />
        <Text slot="label">Drag and drop files here</Text>
      </DropZone>
    </div>
  );
}
