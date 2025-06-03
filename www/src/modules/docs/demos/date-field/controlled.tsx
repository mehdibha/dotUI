"use client";

import type { DateValue } from "react-aria-components";
import React from "react";
import { DateField } from "@/components/dynamic-ui/date-field";
import { parseDate } from "@internationalized/date";

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
