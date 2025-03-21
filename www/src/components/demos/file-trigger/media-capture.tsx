import React from "react";
import { CameraIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import { FileTrigger } from "@/components/dynamic-core/file-trigger";

export default function FileTriggerDemo() {
  return (
    <FileTrigger defaultCamera="environment">
      <Button prefix={<CameraIcon />}>Take a picture</Button>
    </FileTrigger>
  );
}
