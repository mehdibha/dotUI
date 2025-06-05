"use client";

import React from "react";
import { DatePicker } from "@/components/dynamic-ui/date-picker";
import { parseDate } from "@internationalized/date";

export default function Demo() {
  return (
    <DatePicker
      aria-label="Meeting date"
      defaultValue={parseDate("2020-02-03")}
    />
  );
}
