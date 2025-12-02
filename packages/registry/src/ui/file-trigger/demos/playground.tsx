"use client";

import { Button } from "@dotui/registry/ui/button";
import type { Control } from "@dotui/registry/playground";

import { FileTrigger } from "../index";

interface FileTriggerPlaygroundProps {
  allowsMultiple?: boolean;
}

export function FileTriggerPlayground({
  allowsMultiple = false,
}: FileTriggerPlaygroundProps) {
  return (
    <FileTrigger allowsMultiple={allowsMultiple}>
      <Button>Upload File</Button>
    </FileTrigger>
  );
}

export const fileTriggerControls: Control[] = [
  {
    type: "boolean",
    name: "allowsMultiple",
    defaultValue: false,
  },
];
