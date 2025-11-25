"use client";

import type { Control } from "@dotui/registry/playground";

import { Calendar } from "../../index";

interface RangeCalendarPlaygroundProps {
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

export function RangeCalendarPlayground({
  isDisabled = false,
  isReadOnly = false,
}: RangeCalendarPlaygroundProps) {
  return (
    <Calendar
      mode="range"
      aria-label="Date range"
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
    />
  );
}

export const rangeCalendarControls: Control[] = [
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
