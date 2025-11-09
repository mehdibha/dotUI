"use client";

import { UploadIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { FileTrigger } from "@dotui/registry/ui/file-trigger";

export default function Page() {
  return (
    <FileTrigger onSelect={(e) => console.log(e)}>
      <Button>
        <UploadIcon />
        Upload
      </Button>
    </FileTrigger>
  );
}
