import React from "react";
import { DateRangePicker } from "@/components/dynamic-ui/date-range-picker";

export function DateRangePickerDemo() {
  return (
    <div className="flex gap-4">
      <DateRangePicker label="Select date range" />
    </div>
  );
}
