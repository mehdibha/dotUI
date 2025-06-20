import React from "react";
import { CameraIcon } from "lucide-react";

import { Button } from "@dotui/ui/components/button";
import { FileTrigger } from "@dotui/ui/components/file-trigger";

export default function FileTriggerDemo() {
  return (
    <FileTrigger defaultCamera="environment">
      <Button prefix={<CameraIcon />}>Take a picture</Button>
    </FileTrigger>
  );
}
