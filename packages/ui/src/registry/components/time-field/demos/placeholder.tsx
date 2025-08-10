"use client";

import { Time } from "@internationalized/date";

import { TimeField } from "@dotui/ui/components/time-field";

export default function Demo() {
  return <TimeField aria-label="Event time" placeholderValue={new Time(9)} />;
}
