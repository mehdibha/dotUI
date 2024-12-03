"use client";

import React from "react";
import { ContextualHelp } from "@/components/dynamic-core/contextual-help";
import { DatePicker } from "@/components/dynamic-core/date-picker";

export default function Demo() {
  return (
    <DatePicker
      label="Appointment"
      contextualHelp={
        <ContextualHelp
          title="Need help?"
          description="If you're having trouble, contact our customer
      support team for help."
        />
      }
    />
  );
}
