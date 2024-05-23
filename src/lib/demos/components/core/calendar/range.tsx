"use client";

import * as React from "react";
import { RangeCalendar, Calendar } from "@/lib/components/core/default/calendar";

export default function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <RangeCalendar
    // mode="single"
    // selected={date}
    // onSelect={setDate}
    // className="rounded-md border"
    />
  );
}
