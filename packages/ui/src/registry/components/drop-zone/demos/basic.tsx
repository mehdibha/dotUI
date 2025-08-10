import React from "react";

import { DropZone } from "@dotui/ui/components/drop-zone";
import { UploadIcon } from "@dotui/ui/icons";

export default function Demo() {
  return (
    <DropZone>
      <UploadIcon className="text-fg-muted size-5" />
    </DropZone>
  );
}
