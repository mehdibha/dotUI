import React from "react";

import { Button } from "@dotui/ui/components/button";
import { FileTrigger } from "@dotui/ui/components/file-trigger";
import { UploadIcon } from "@dotui/ui/icons";

export default function FileTriggerDemo() {
  return (
    <FileTrigger acceptedFileTypes={["image/*"]}>
      <Button prefix={<UploadIcon />}>Upload image</Button>
    </FileTrigger>
  );
}
