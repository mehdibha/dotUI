import React from "react";
import { UploadIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { FileTrigger } from "@dotui/ui/components/file-trigger";

export default function FileTriggerDemo() {
  return (
    <FileTrigger acceptedFileTypes={["image/*"]}>
      <Button prefix={<UploadIcon />}>Upload image</Button>
    </FileTrigger>
  );
}
