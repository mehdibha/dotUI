"use client";

import React from "react";
import { parseDate } from "@internationalized/date";
import { DateRangePicker } from "@/components/dynamic-core/date-range-picker";

export default function Demo() {
  return (
    <DateRangePicker
      label="Controlled"
      defaultValue={{
        start: parseDate("2020-02-03"),
        end: parseDate("2020-02-08"),
      }}
    />
  );
}
