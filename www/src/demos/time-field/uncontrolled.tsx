"use client";

import { Time } from "@internationalized/date";
import { TimeField } from "@/components/dynamic-core/time-field";

export default function Demo() {
  return <TimeField defaultValue={new Time(11, 45)} />;
}
