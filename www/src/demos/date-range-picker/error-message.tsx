"use client";

import React from "react";
import { DateRangePicker } from "@/components/dynamic-core/date-range-picker";

export default function Demo() {
  return (
    <DateRangePicker
      label="Trip dates"
      isInvalid
      errorMessage="Trip dates can't be scheduled in the past."
    />
  );
}
