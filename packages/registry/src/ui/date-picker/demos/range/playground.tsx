"use client";

import { Calendar } from "@dotui/registry/ui/calendar";
import { Label } from "@dotui/registry/ui/field";
import type { Control } from "@dotui/registry/playground";

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
    defaultValue: "Date range",
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
];
