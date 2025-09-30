import React from "react";

import { UploadIcon } from "@dotui/registry/icons";
import { DropZone } from "@dotui/registry/ui/drop-zone";

export default function Demo() {
  return (
    <DropZone>
      <UploadIcon className="text-fg-muted size-5" />
    </DropZone>
  );
}
