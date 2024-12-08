import React from "react";
import { UploadIcon } from "lucide-react";
import { DropZone } from "@/components/dynamic-core/drop-zone";
import { Text } from "@/components/dynamic-core/text";

export default function Demo() {
  return (
    <DropZone isDisabled>
      <UploadIcon />
      <Text slot="label">Drag and drop files here</Text>
    </DropZone>
  );
}
