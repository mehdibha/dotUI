import React from "react";
import { ContextualHelp } from "@/components/dynamic-core/contextual-help";
import { NumberField } from "@/components/dynamic-core/number-field";

export default function Demo() {
  return (
    <NumberField
      label="Width"
      defaultValue={1024}
      contextualHelp={
        <ContextualHelp
          title="Need help?"
          description="If you need help, please contact support."
        />
      }
    />
  );
}
