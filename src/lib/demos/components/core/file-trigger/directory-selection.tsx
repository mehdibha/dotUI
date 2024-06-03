"use client";

import React from "react";
import { UploadIcon } from "lucide-react";
import { Button } from "@/lib/components/core/default/button";
import { FileTrigger } from "@/lib/components/core/default/file-trigger";

export default function FileTriggerDemo() {
  const [files, setFiles] = React.useState<string[] | null>(null);
  return (
    <div className="flex flex-col items-center gap-4">
      <FileTrigger
        acceptDirectory
        onSelect={(e) => {
          if (e) {
            const files = Array.from(e);
            const filenames = files.map((file) => file.name);
            setFiles(filenames);
          }
        }}
      >
        <Button prefix={<UploadIcon />}>Upload a directory</Button>
      </FileTrigger>
      {files && (
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
