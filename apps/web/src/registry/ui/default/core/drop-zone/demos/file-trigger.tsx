import React from "react";
import { UploadIcon } from "@/lib/icons";
import { Button } from "@/registry/ui/default/core/button";
import { DropZone } from "@/registry/ui/default/core/drop-zone";
import { FileTrigger } from "@/registry/ui/default/core/file-trigger";
import { Text } from "@/registry/ui/default/core/text";

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
