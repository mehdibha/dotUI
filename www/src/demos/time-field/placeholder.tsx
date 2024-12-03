"use client";

import { Time } from "@internationalized/date";
import { TimeField } from "@/registry/ui/default/core/time-field";

export default function Demo() {
  return <TimeField placeholderValue={new Time(9)} />;
}
