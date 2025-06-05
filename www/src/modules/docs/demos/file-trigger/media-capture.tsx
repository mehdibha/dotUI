import React from "react";
import { Button } from "@/components/dynamic-ui/button";
import { FileTrigger } from "@/components/dynamic-ui/file-trigger";
import { CameraIcon } from "lucide-react";

export default function FileTriggerDemo() {
  return (
    <FileTrigger defaultCamera="environment">
      <Button prefix={<CameraIcon />}>Take a picture</Button>
    </FileTrigger>
  );
}
