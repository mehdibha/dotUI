"use client";

import React from "react";
import { UploadIcon } from "@/__icons__";
import { Button } from "@/registry/ui/default/core/button";
import { FileTrigger } from "@/registry/ui/default/core/file-trigger";

export default function FileTriggerDemo() {
  const [file, setFile] = React.useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-4">
      <FileTrigger
        onSelect={(e) => {
          if (e) {
            const files = Array.from(e);
            setFile(files[0].name);
          }
        }}
        allowsMultiple
      >
        <Button prefix={<UploadIcon />}>Upload</Button>
      </FileTrigger>
      {file && (
        <p>
          You selected <span className="font-semibold">{file}</span>
        </p>
      )}
    </div>
  );
}
