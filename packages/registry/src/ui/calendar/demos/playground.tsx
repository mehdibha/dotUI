"use client";

import { Calendar } from "@dotui/registry/ui/calendar";

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
