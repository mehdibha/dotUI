"use client";

import { Time } from "@internationalized/date";
import { TimeField } from "@/components/dynamic-ui/time-field";

export default function Demo() {
  return <TimeField aria-label="Event time" defaultValue={new Time(11, 45)} />;
}
