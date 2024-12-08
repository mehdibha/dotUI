"use client";

import { Time } from "@internationalized/date";
import { TimeField } from "@/components/dynamic-core/time-field";

export default function Demo() {
  return <TimeField placeholderValue={new Time(9)} />;
}
