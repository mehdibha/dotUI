"use client";

import React from "react";
import { parseDate } from "@internationalized/date";
import { Calendar } from "@/components/dynamic-core/calendar";

export default function Demo() {
  return (
    <Calendar
      aria-label="Appointment date"
      defaultValue={parseDate("2020-02-03")}
    />
  );
}
