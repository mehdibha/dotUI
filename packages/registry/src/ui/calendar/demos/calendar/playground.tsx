"use client";

import type { Control } from "@dotui/registry/playground";

import { Calendar } from "../../index";

interface CalendarPlaygroundProps {
  isDisabled?: boolean;
  isReadOnly?: boolean;
}

export function CalendarPlayground({
  isDisabled = false,
  isReadOnly = false,
}: CalendarPlaygroundProps) {
  return (
    <Calendar
      aria-label="Date"
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
    />
  );
}

export const calendarControls: Control[] = [
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
