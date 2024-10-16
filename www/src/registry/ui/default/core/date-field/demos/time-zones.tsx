"use client";

import { parseAbsoluteToLocal } from "@internationalized/date";
import { DateField } from "@/registry/ui/default/core/date-field";

export default function Demo() {
  return (
    <DateField defaultValue={parseAbsoluteToLocal("2021-11-07T07:45:00Z")} />
  );
}
