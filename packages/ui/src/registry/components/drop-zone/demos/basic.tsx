import React from "react";
import { UploadIcon } from "lucide-react";

import { DropZone } from "@dotui/ui/components/drop-zone";

export default function Demo() {
  return (
    <DropZone>
      <UploadIcon className="size-5 text-fg-muted" />
    </DropZone>
  );
}
