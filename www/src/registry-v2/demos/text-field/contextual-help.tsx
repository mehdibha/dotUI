"use client";

import React from "react";
import { ContextualHelp } from "@/components/dynamic-core/contextual-help";
import { TextField } from "@/components/dynamic-core/text-field";

export default function Demo() {
  return (
    <TextField
      label="Password"
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
