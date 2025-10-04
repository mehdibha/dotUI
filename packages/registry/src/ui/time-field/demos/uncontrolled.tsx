"use client";

import { Time } from "@internationalized/date";

import { TimeField } from "@dotui/registry/ui/time-field";

export default function Demo() {
  return <TimeField aria-label="Event time" defaultValue={new Time(11, 45)} />;
}
