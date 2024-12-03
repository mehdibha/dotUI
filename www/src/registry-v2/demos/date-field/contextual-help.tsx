"use client";

import React from "react";
import { ContextualHelp } from "@/components/dynamic-core/contextual-help";
import { DateField } from "@/components/dynamic-core/date-field";

export default function Demo() {
  return (
    <DateField
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
