import React from "react";
import { Button } from "@/components/dynamic-core/button";
import { FileTrigger } from "@/components/dynamic-core/file-trigger";
import { CameraIcon } from "@/__icons__";

export default function FileTriggerDemo() {
  return (
    <FileTrigger defaultCamera="environment">
      <Button prefix={<CameraIcon />}>Take a picture</Button>
    </FileTrigger>
  );
}
