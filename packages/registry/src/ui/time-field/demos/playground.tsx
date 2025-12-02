"use client";

import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";
import type { Control } from "@dotui/registry/playground";

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
    defaultValue: "Time",
  },
  {
    type: "boolean",
    name: "isDisabled",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isReadOnly",
    defaultValue: false,
  },
  {
    type: "boolean",
    name: "isInvalid",
    defaultValue: false,
  },
];
