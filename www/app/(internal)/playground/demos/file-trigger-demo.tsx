"use client";

import React from "react";

import { UploadIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { FileTrigger } from "@dotui/registry/ui/file-trigger";

export function FileTriggerDemo() {
  const [file, setFile] = React.useState<string | null>(null);
  return (
    <div className="flex items-center gap-4">
      <FileTrigger
        onSelect={(e) => {
          if (e) {
            const files = Array.from(e);
            const fileName = files[0]?.name;
            if (fileName) setFile(fileName);
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
