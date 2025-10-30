"use client";

import React from "react";

import { UploadIcon } from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { FileTrigger } from "@dotui/registry/ui/file-trigger";

export default function FileTriggerDemo() {
  const [files, setFiles] = React.useState<string[] | null>(null);
  return (
    <div className="flex flex-col items-center gap-4">
      <FileTrigger
        onSelect={(e) => {
          if (e) {
            const files = Array.from(e);
            const filenames = files.map((file) => file.name);
            setFiles(filenames);
          }
        }}
        allowsMultiple
      >
        <Button>
          <UploadIcon /> Upload
        </Button>
      </FileTrigger>
      {files && (
        <p>
          You selected <span className="font-semibold">{files.join(", ")}</span>
        </p>
      )}
    </div>
  );
}
