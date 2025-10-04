"use client";

import React from "react";
import { Time } from "@internationalized/date";
import type { TimeValue } from "react-aria-components";

import { TimeField } from "@dotui/registry/ui/time-field";

export default function Demo() {
  const [time, setTime] = React.useState<TimeValue | null>(new Time(11, 45));
  return (
    <div className="flex flex-col items-center gap-4">
      <TimeField aria-label="Event time" value={time} onChange={setTime} />
      <p className="text-sm text-fg-muted">selected time: {time?.toString()}</p>
    </div>
  );
}
