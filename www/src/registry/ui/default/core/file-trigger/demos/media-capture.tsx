import React from "react";
import { Button } from "@/registry/ui/default/core/button";
import { FileTrigger } from "@/registry/ui/default/core/file-trigger";
import { CameraIcon } from "@/__icons__";

export default function FileTriggerDemo() {
  return (
    <FileTrigger defaultCamera="environment">
      <Button prefix={<CameraIcon />}>Take a picture</Button>
    </FileTrigger>
  );
}
