import React from "react";

import { UploadIcon } from "@dotui/registry/icons";
import { DropZone } from "@dotui/registry/ui/drop-zone";

export default function Demo() {
  return (
    <DropZone>
      <UploadIcon className="size-5 text-fg-muted" />
    </DropZone>
  );
}
