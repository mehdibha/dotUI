"use client";

import React from "react";
import { DateRangePicker } from "@/registry/ui/default/core/date-range-picker";

export default function Demo() {
  return (
    <DateRangePicker label="Trip" description="Please select a date range." />
  );
}