"use client";

import React from "react";
import { Time } from "@internationalized/date";
import { TimeField } from "@/components/dynamic-core/time-field";

export default function Demo() {
  const [time, setTime] = React.useState(new Time(11, 45));
  return (
    <div className="flex flex-col items-center gap-4">
      <TimeField value={time} onChange={setTime} />
      <p className="text-fg-muted text-sm">selected time: {time.toString()}</p>
    </div>
  );
}
