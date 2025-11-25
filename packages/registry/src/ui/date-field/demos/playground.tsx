"use client";

import type { Control } from "@dotui/registry/playground";
import { Label } from "@dotui/registry/ui/field";
import { DateInput } from "@dotui/registry/ui/input";

import { DateField } from "../index";

interface DateFieldPlaygroundProps {
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
}

export function DateFieldPlayground({
  label = "Date",
  ...props
}: DateFieldPlaygroundProps) {
  return (
    <DateField {...props}>
      {label && <Label>{label}</Label>}
      <DateInput />
    </DateField>
  );
}

export const dateFieldControls: Control[] = [
  {
    type: "string",
    name: "label",
    label: "Label",
    defaultValue: "Date",
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

