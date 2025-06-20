"use client";

import React from "react";
import { parseDate } from "@internationalized/date";

import { DatePicker } from "@dotui/ui/components/date-picker";

export default function Demo() {
  return (
    <DatePicker
      aria-label="Meeting date"
      defaultValue={parseDate("2020-02-03")}
    />
  );
}
