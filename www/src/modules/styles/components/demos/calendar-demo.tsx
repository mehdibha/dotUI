"use client";

import React from "react";
import { Calendar } from "@/components/dynamic-core/calendar";

export function CalendarDemo() {
  return (
    <div>
      <Calendar aria-label="Select date" className="rounded-lg border" />
    </div>
  );
}
