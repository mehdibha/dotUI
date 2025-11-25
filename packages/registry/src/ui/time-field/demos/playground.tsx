"use client";

import type { Control } from "@dotui/registry/playground";
import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";

import { TimeField } from "../index";

interface TimeFieldPlaygroundProps {
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
}

export function TimeFieldPlayground({
  label = "Time",
  ...props
}: TimeFieldPlaygroundProps) {
  return (
    <TimeField {...props}>
      {label && <Label>{label}</Label>}
      <DateInput />
    </TimeField>
  );
}

export const timeFieldControls: Control[] = [
  {
    type: "string",
    name: "label",
    label: "Label",
    defaultValue: "Time",
  },
  {
    type: "boolean",
    name: "isDisabled",
    label: "Disabled",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isReadOnly",
    label: "Read Only",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isInvalid",
    label: "Invalid",
    defaultValue: false,
  },
];

