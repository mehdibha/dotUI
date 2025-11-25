"use client";

import type { Control } from "@dotui/registry/playground";
import { Calendar } from "@dotui/registry/ui/calendar";
import { Label } from "@dotui/registry/ui/field";

import { DatePicker, DatePickerContent, DatePickerInput } from "../../index";

interface DateRangePickerPlaygroundProps {
  label?: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

export function DateRangePickerPlayground({
  label = "Date range",
  isDisabled = false,
  isReadOnly = false,
}: DateRangePickerPlaygroundProps) {
  return (
    <DatePicker mode="range" isDisabled={isDisabled} isReadOnly={isReadOnly}>
      {label && <Label>{label}</Label>}
      <DatePickerInput />
      <DatePickerContent>
        <Calendar mode="range" />
      </DatePickerContent>
    </DatePicker>
  );
}

export const dateRangePickerControls: Control[] = [
  {
    type: "string",
    name: "label",
    label: "Label",
    defaultValue: "Date range",
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

