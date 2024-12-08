"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";
import { TimeField } from "@/components/dynamic-core/time-field";

export default function Demo() {
  return (
    <TimeField
      granularity="second"
      defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}
    />
  );
}
