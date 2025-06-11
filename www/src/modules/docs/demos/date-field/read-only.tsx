"use client";

import React from "react";
import { DateField } from "@/components/dynamic-ui/date-field";
import { CalendarDate } from "@internationalized/date";

export default function Demo() {
  return (
    <DateField
      label="Event date"
      value={new CalendarDate(1980, 1, 1)}
      isReadOnly
    />
  );
}
