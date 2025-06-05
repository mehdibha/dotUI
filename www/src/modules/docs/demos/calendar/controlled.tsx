"use client";

import React from "react";
import { Calendar } from "@/components/dynamic-ui/calendar";
import { parseDate } from "@internationalized/date";
import { DateValue } from "react-aria-components";

export default function Demo() {
  const [value, setValue] = React.useState<DateValue>(parseDate("2025-01-01"));
  return (
    <div className="flex flex-col items-center gap-6">
      <Calendar aria-label="Event date" value={value} onChange={setValue} />
      <p className="text-fg-muted text-sm">
        Selected date: {value?.toString()}
      </p>
    </div>
  );
}
