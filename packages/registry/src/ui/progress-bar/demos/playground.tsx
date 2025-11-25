"use client";

import type { Control } from "@dotui/registry/playground";
import { Label } from "@dotui/registry/ui/field";

import { ProgressBar, ProgressBarControl } from "../index";

interface ProgressBarPlaygroundProps {
  label?: string;
  value?: number;
  isIndeterminate?: boolean;
}

export function ProgressBarPlayground({
  label = "Loading...",
  value = 60,
  isIndeterminate = false,
}: ProgressBarPlaygroundProps) {
  return (
    <ProgressBar
      value={isIndeterminate ? undefined : value}
      isIndeterminate={isIndeterminate}
    >
      {label && <Label>{label}</Label>}
      <ProgressBarControl />
    </ProgressBar>
  );
}

export const progressBarControls: Control[] = [
  {
    type: "string",
    name: "label",
    label: "Label",
    defaultValue: "Loading...",
  },
  {
    type: "number",
    name: "value",
    label: "Value",
    defaultValue: 60,
    min: 0,
    max: 100,
  },
  {
    type: "boolean",
    name: "isIndeterminate",
    label: "Indeterminate",
    defaultValue: false,
  },
];

