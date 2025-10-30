"use client";

import React from "react";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";

import { DateField } from "@dotui/registry/ui/date-field";
import { DateInput } from "@dotui/registry/ui/input";

export default function Demo() {
  const [value, setValue] = React.useState<DateValue | null>(
    parseDate("2020-02-03"),
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <DateField aria-label="Event date" value={value} onChange={setValue}>
        <DateInput />
      </DateField>
      <p className="text-sm text-fg-muted">
        selected date: {value ? value.toString() : "none"}
      </p>
    </div>
  );
}
