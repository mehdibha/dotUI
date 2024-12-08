"use client";

import React from "react";
import { CalendarDate } from "@internationalized/date";
import { DatePicker } from "@/components/dynamic-core/date-picker";

export default function Demo() {
  return (
    <DatePicker
      label="Event date"
      value={new CalendarDate(1980, 1, 1)}
      isReadOnly
    />
  );
}
