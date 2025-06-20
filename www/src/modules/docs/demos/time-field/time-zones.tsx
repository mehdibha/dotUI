"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";

import { TimeField } from "@dotui/ui/components/time-field";

export default function Demo() {
  return (
    <TimeField
      aria-label="Event time"
      defaultValue={parseAbsoluteToLocal("2021-11-07T07:45:00Z")}
    />
  );
}
