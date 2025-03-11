"use client";

import React from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/dynamic-core/button";
import { FileTrigger } from "@/components/dynamic-core/file-trigger";

export default function FileTriggerDemo() {
  const [file, setFile] = React.useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-4">
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
