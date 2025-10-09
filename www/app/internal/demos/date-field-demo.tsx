"use client";

import { DateField } from "@dotui/registry-v2/ui/date-field";

export function DateFieldDemo() {
  return (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <DateField key={size} size={size} label={`Size: ${size}`} />
      ))}

      <DateField label="Birth date" description="Enter your birth date" />

      <DateField
        label="Required date"
        isRequired
        errorMessage="Please enter a date"
      />

      <DateField label="Disabled" isDisabled />

      <DateField
        label="With description"
        description="Select a date for your appointment"
      />
    </div>
  );
}
