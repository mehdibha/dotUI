"use client";

import { DatePicker } from "@dotui/registry-v2/ui/date-picker";

export function DatePickerDemo() {
  return (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <DatePicker key={size} size={size} label={`Size: ${size}`} />
      ))}

      <DatePicker
        label="Event date"
        description="Select a date for your event"
      />

      <DatePicker
        label="Required date"
        isRequired
        errorMessage="Please select a date"
      />

      <DatePicker label="Disabled" isDisabled />

      <DatePicker
        label="Appointment"
        description="Choose your appointment date"
      />
    </div>
  );
}
