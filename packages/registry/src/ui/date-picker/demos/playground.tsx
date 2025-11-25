"use client";

import { Calendar } from "@dotui/registry/ui/calendar";
import { Label } from "@dotui/registry/ui/field";
import type { Control } from "@dotui/registry/playground";

import { DatePicker, DatePickerContent, DatePickerInput } from "../index";

interface DatePickerPlaygroundProps {
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

export function DatePickerPlayground({
  label = "Date",
  isDisabled = false,
  isReadOnly = false,
}: DatePickerPlaygroundProps) {
  return (
    <DatePicker isDisabled={isDisabled} isReadOnly={isReadOnly}>
      {label && <Label>{label}</Label>}
      <DatePickerInput />
      <DatePickerContent>
        <Calendar />
      </DatePickerContent>
    </DatePicker>
  );
}

export const datePickerControls: Control[] = [
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
];
