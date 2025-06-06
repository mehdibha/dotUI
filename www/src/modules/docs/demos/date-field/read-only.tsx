"use client";

import React from "react";
import { CalendarDate } from "@internationalized/date";
import { DateField } from "@/components/dynamic-ui/date-field";

export default function Demo() {
  return (
    <DateField
      label="Event date"
      value={new CalendarDate(1980, 1, 1)}
      isReadOnly
    />
  );
}
