import React from "react";
import { Button } from "@/registry/ui/default/core/button";
import { FileTrigger } from "@/registry/ui/default/core/file-trigger";
import { UploadIcon } from "@/__icons__";

export default function FileTriggerDemo() {
  return (
    <FileTrigger acceptedFileTypes={["image/*"]}>
      <Button prefix={<UploadIcon />}>Upload image</Button>
    </FileTrigger>
  );
}
