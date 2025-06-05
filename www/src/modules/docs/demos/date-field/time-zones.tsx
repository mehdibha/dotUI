"use client";

import { DateField } from "@/components/dynamic-ui/date-field";
import { parseAbsoluteToLocal } from "@internationalized/date";

export default function Demo() {
  return (
    <DateField
      aria-label="Meeting time"
      defaultValue={parseAbsoluteToLocal("2021-11-07T07:45:00Z")}
      className="w-auto"
    />
  );
}
