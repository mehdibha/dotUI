"use client";

import React from "react";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";
import { DateField } from "@/components/dynamic-ui/date-field";

export default function Demo() {
  const [value, setValue] = React.useState<DateValue | null>(
    parseDate("2020-02-03")
  );
  return (
    <div className="flex flex-col items-center gap-4">
      <DateField aria-label="Event date" value={value} onChange={setValue} />
      <p className="text-fg-muted text-sm">
        selected date: {value ? value.toString() : "none"}
      </p>
    </div>
  );
}
