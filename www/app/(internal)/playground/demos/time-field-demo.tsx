"use client";

import { TimeField } from "@dotui/registry-v2/ui/time-field";

export function TimeFieldDemo() {
  return (
    <div className="flex flex-col gap-6">
      {(["sm", "md", "lg"] as const).map((size) => (
        <TimeField key={size} size={size} label={`Size: ${size}`} />
      ))}

      <TimeField label="Meeting time" description="Enter the meeting time" />

      <TimeField
        label="Required time"
        isRequired
        errorMessage="Please enter a time"
      />

      <TimeField label="Disabled" isDisabled />

      <TimeField
        label="With description"
        description="Select a time for your alarm"
      />
    </div>
  );
}
