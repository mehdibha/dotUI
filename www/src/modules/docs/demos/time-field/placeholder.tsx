"use client";

import { TimeField } from "@/components/dynamic-ui/time-field";
import { Time } from "@internationalized/date";

export default function Demo() {
  return <TimeField aria-label="Event time" placeholderValue={new Time(9)} />;
}
