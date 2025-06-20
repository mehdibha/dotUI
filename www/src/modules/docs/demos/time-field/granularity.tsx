"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";

import { TimeField } from "@dotui/ui/components/time-field";

export default function Demo() {
  return (
    <TimeField
      aria-label="Event time"
      granularity="second"
      defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}
      className="w-40"
    />
  );
}
