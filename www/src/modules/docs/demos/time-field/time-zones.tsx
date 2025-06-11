"use client";

import { TimeField } from "@/components/dynamic-ui/time-field";
import { parseAbsoluteToLocal } from "@internationalized/date";

export default function Demo() {
  return (
    <TimeField
      aria-label="Event time"
      defaultValue={parseAbsoluteToLocal("2021-11-07T07:45:00Z")}
    />
  );
}
