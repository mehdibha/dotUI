import React from "react";
import { UploadIcon } from "lucide-react";

import { DropZone } from "@dotui/ui/components/drop-zone";

export default function Demo() {
  return (
    <DropZone>
      <UploadIcon className="text-fg-muted size-5" />
    </DropZone>
  );
}
