"use client";

import React from "react";
import { Calendar } from "@/components/dynamic-ui/calendar";
import { parseDate } from "@internationalized/date";

export default function Demo() {
  return (
    <Calendar
      aria-label="Appointment date"
      defaultValue={parseDate("2020-02-03")}
    />
  );
}
