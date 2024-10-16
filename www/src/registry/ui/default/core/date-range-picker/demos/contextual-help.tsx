"use client";

import React from "react";
import { ContextualHelp } from "@/registry/ui/default/core/contextual-help";
import { DateRangePicker } from "@/registry/ui/default/core/date-range-picker";

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
