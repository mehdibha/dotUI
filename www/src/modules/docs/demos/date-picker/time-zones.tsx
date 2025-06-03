"use client";

import { DatePicker } from "@/components/dynamic-ui/date-picker";
import { parseAbsoluteToLocal } from "@internationalized/date";

export default function Demo() {
  return (
    <DatePicker defaultValue={parseAbsoluteToLocal("2021-11-07T07:45:00Z")} />
  );
}
