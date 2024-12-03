"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";
import { DatePicker } from "@/components/dynamic-core/date-picker";

export default function Demo() {
  return (
    <DatePicker defaultValue={parseAbsoluteToLocal("2021-11-07T07:45:00Z")} />
  );
}
