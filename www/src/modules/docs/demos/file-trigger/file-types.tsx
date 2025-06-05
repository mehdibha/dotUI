import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { FileTrigger } from "@/components/dynamic-ui/file-trigger";
import { UploadIcon } from "lucide-react";

export default function FileTriggerDemo() {
  return (
    <FileTrigger acceptedFileTypes={["image/*"]}>
      <Button prefix={<UploadIcon />}>Upload image</Button>
    </FileTrigger>
  );
}
