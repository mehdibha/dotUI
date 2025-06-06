"use client";

import React from "react";
import { DatePicker } from "@/components/dynamic-ui/date-picker";

export default function Demo() {
  return (
    <DatePicker
      label="Meeting"
      isInvalid
      errorMessage="Meetings can't be scheduled in the past."
    />
  );
}
