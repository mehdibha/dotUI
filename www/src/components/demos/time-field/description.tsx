"use client";

import React from "react";
import { TimeField } from "@/components/dynamic-core/time-field";

export default function Demo() {
  return (
    <TimeField
      label="Appointment"
      description="Please select a time between 9 AM and 5 PM."
    />
  );
}
