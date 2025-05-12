import React from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/dynamic-ui/button";
import { FileTrigger } from "@/components/dynamic-ui/file-trigger";

export default function FileTriggerDemo() {
  return (
    <FileTrigger acceptedFileTypes={["image/*"]}>
      <Button prefix={<UploadIcon />}>Upload image</Button>
    </FileTrigger>
  );
}
