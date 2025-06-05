"use client";

import React from "react";
import { DatePicker } from "@/components/dynamic-ui/date-picker";
import { CalendarDate } from "@internationalized/date";

export default function Demo() {
  return (
    <DatePicker
      label="Event date"
      value={new CalendarDate(1980, 1, 1)}
      isReadOnly
    />
  );
}
