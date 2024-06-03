import React from "react";
import { CameraIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { FileTrigger } from "@/lib/components/core/default/file-trigger";

export default function FileTriggerDemo() {
  return (
    <FileTrigger defaultCamera="environment">
      <Button prefix={<CameraIcon />}>Take a picture</Button>
    </FileTrigger>
  );
}
