import React from "react";

import { DropZone } from "@dotui/ui/components/drop-zone";
import { UploadIcon } from "@dotui/ui/icons";

export default function Demo() {
  return (
    <DropZone>
      <UploadIcon className="size-5 text-fg-muted" />
    </DropZone>
  );
}
