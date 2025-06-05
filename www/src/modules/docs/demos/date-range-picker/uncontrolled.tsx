"use client";

import React from "react";
import { DateRangePicker } from "@/components/dynamic-ui/date-range-picker";
import { parseDate } from "@internationalized/date";

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
