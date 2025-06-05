"use client";

import { DateField } from "@/components/dynamic-ui/date-field";
import { parseAbsoluteToLocal } from "@internationalized/date";

export default function Demo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <DateField
        label="Hour"
        granularity="hour"
        defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}
      />
      <DateField
        label="Minute"
        granularity="minute"
        defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}
      />
      <DateField
        label="Second"
        granularity="second"
        defaultValue={parseAbsoluteToLocal("2021-04-07T18:45:22Z")}
      />
    </div>
  );
}
