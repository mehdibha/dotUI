import React from "react";
import { Button } from "@/components/dynamic-core/button";
import { FileTrigger } from "@/components/dynamic-core/file-trigger";
import { UploadIcon } from "@/__icons__";

export default function FileTriggerDemo() {
  return (
    <FileTrigger acceptedFileTypes={["image/*"]}>
      <Button prefix={<UploadIcon />}>Upload image</Button>
    </FileTrigger>
  );
}
