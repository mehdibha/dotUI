"use client";

import React from "react";

import { TimeField } from "@dotui/ui/components/time-field";

export default function Demo() {
  return (
    <TimeField
      label="Meeting"
      isInvalid
      errorMessage="Meetings start every 15 minutes."
    />
  );
}
