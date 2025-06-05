"use client";

import type { TimeValue } from "react-aria-components";
import React from "react";
import { TimeField } from "@/components/dynamic-ui/time-field";
import { Time } from "@internationalized/date";

export default function Demo() {
  const [time, setTime] = React.useState<TimeValue | null>(new Time(11, 45));
  return (
    <div className="flex flex-col items-center gap-4">
      <TimeField aria-label="Event time" value={time} onChange={setTime} />
      <p className="text-fg-muted text-sm">selected time: {time?.toString()}</p>
    </div>
  );
}
