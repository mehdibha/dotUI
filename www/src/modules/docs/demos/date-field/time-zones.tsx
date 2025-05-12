"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";
import { DateField } from "@/components/dynamic-ui/date-field";

export default function Demo() {
  return (
    <DateField
      aria-label="Meeting time"
      defaultValue={parseAbsoluteToLocal("2021-11-07T07:45:00Z")}
      className="w-auto"
    />
  );
}
