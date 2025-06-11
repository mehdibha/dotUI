"use client";

import { TimeField } from "@/components/dynamic-ui/time-field";
import { parseAbsoluteToLocal } from "@internationalized/date";

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
