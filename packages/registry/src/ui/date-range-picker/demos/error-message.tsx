"use client";

import { DateRangePicker } from "@dotui/registry/ui/date-range-picker";

export default function Demo() {
  return (
    <DateRangePicker
      label="Trip dates"
      isInvalid
      errorMessage="Trip dates can't be scheduled in the past."
    />
  );
}
