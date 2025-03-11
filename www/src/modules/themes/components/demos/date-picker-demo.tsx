import React from "react";
import { DatePicker } from "@/components/dynamic-core/date-picker";

export function DatePickerDemo() {
  return (
    <div className="flex gap-4">
      <DatePicker label="Select date" />
    </div>
  );
}
