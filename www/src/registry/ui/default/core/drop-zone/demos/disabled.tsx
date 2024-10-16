import React from "react";
import { DropZone } from "@/registry/ui/default/core/drop-zone";
import { Text } from "@/registry/ui/default/core/text";
import { UploadIcon } from "@/__icons__";

export default function Demo() {
  return (
    <DropZone isDisabled>
      <UploadIcon />
      <Text slot="label">Drag and drop files here</Text>
    </DropZone>
  );
}
