"use client";

import React from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Calendar } from "@/registry/ui/default/core/calendar";

export default function Demo() {
  return (
    <Calendar
      aria-label="Appointment date"
      defaultValue={today(getLocalTimeZone())}
    />
  );
}
