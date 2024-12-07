import React from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import { DropZone } from "@/components/dynamic-core/drop-zone";
import { FileTrigger } from "@/components/dynamic-core/file-trigger";
import { Text } from "@/components/dynamic-core/text";

export default function Demo() {
  return (
    <DropZone className="space-y-1">
      <UploadIcon />
      <Text slot="label">Drag and drop files here</Text>
      <FileTrigger>
        <Button>Select files</Button>
      </FileTrigger>
    </DropZone>
  );
}
