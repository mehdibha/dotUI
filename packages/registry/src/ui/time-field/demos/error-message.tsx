"use client";


import { TimeField } from "@dotui/registry/ui/time-field";

export default function Demo() {
  return (
    <TimeField
      label="Meeting"
      isInvalid
      errorMessage="Meetings start every 15 minutes."
    />
  );
}
