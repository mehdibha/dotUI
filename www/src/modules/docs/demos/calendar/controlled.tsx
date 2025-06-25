"use client";

import React from "react";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "react-aria-components";

import { Calendar } from "@dotui/ui/components/calendar";

export default function Demo() {
  const [value, setValue] = React.useState<DateValue>(parseDate("2025-01-01"));
  return (
    <div className="flex flex-col items-center gap-6">
      <Calendar aria-label="Event date" value={value} onChange={setValue} />
      <p className="text-sm text-fg-muted">
        Selected date: {value?.toString()}
      </p>
    </div>
  );
}
