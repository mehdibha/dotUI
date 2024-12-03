"use client";

import React from "react";
import { ContextualHelp } from "@/components/dynamic-core/contextual-help";
import { DateRangePicker } from "@/components/dynamic-core/date-range-picker";

export default function Demo() {
  return (
    <DateRangePicker
      label="Trip"
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
