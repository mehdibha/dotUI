"use client";

import React from "react";
import { ContextualHelp } from "@/components/dynamic-core/contextual-help";
import { TimeField } from "@/components/dynamic-core/time-field";

export default function Demo() {
  return (
    <TimeField
      label="Appointment"
      contextualHelp={
        <ContextualHelp
          title="Need help?"
          description="If you're having trouble accessing your account, contact our customer
      support team for help."
        />
      }
    />
  );
}
