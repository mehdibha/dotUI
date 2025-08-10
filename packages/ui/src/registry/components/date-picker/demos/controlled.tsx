"use client";

import React from "react";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";

import { DatePicker } from "@dotui/ui/components/date-picker";

export default function Demo() {
  const [value, setValue] = React.useState<DateValue | null>(
    parseDate("2020-02-03"),
  );
  return (
    <div className="flex flex-col items-center gap-4">
      <DatePicker label="Meeting date" value={value} onChange={setValue} />
      <p className="text-fg-muted text-sm">
        selected date: {value?.toString()}
      </p>
    </div>
  );
}
