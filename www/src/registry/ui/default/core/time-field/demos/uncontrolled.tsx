"use client";

import { Time } from "@internationalized/date";
import { TimeField } from "@/registry/ui/default/core/time-field";

export default function Demo() {
  return <TimeField defaultValue={new Time(11, 45)} />;
}
