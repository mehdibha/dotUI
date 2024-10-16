"use client";

import React from "react";
import { ContextualHelp } from "@/registry/ui/default/core/contextual-help";
import { DateField } from "@/registry/ui/default/core/date-field";

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
