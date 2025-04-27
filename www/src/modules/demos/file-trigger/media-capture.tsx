import React from "react";
import { CameraIcon } from "lucide-react";
import { Button } from "@/components/dynamic-ui/button";
import { FileTrigger } from "@/components/dynamic-ui/file-trigger";

export default function FileTriggerDemo() {
  return (
    <FileTrigger defaultCamera="environment">
      <Button prefix={<CameraIcon />}>Take a picture</Button>
    </FileTrigger>
  );
}
