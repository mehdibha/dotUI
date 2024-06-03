import React from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { FileTrigger } from "@/lib/components/core/default/file-trigger";

export default function FileTriggerDemo() {
  return (
    <FileTrigger acceptedFileTypes={["image/*"]}>
      <Button prefix={<UploadIcon />}>Upload image</Button>
    </FileTrigger>
  );
}
